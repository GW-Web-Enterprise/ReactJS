import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { CustomFileList } from '@app/typings/files';
import { getSizeOfFiles } from '@app/utils/getSizeOfFiles';
import { Dispatch, MutableRefObject, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import { useAuth } from '@app/hooks/useAuth';

type FilenameMemo = MutableRefObject<{
    [key: string]: boolean;
}>;
// rawFileList in the file input's cache might contain invalid local files, the 'files' state only stores the valid ones
type SetRawFileList = Dispatch<SetStateAction<FileList>>;
type SetValidFiles = Dispatch<SetStateAction<CustomFileList>>;
export const useFileUpload = (
    fileInput: RefObject<HTMLInputElement>,
    facultyId: string,
    repoId: string,
    initialFiles: CustomFileList = []
) => {
    const filenameMemo: FilenameMemo = useRef<{ [key: string]: boolean }>({}); // memoize the filenames of the uploaded files
    const [rawFileList, setRawFileList] = useState<FileList>() as [FileList, SetRawFileList];
    const [files, setFiles] = useState<CustomFileList>(initialFiles) as [CustomFileList, SetValidFiles];
    const [wait, setWait] = useState(false);
    const { showAlert } = useGlobalUtils();
    const { currentUser } = useAuth();

    const handleLocalUpload = useCallback(async () => {
        if (!rawFileList) return;
        setWait(true);
        const validFiles = extractValidFiles(rawFileList, filenameMemo);
        fileInput.current!.value = ''; // clear the cache of the file input after all valid files have been grabbed from it

        if (getSizeOfFiles([...files, ...validFiles])[1] > Math.pow(10, 7)) {
            validFiles.forEach(({ name }) => delete filenameMemo.current[name]); // reset the filenameMemo to its original state on fail
            showAlert({
                status: 'error',
                message: 'Total file size is limited to 10 MB. Selected files cannot be uploaded'
            });
            return setWait(false);
        }
        if (validFiles.length) {
            await uploadToCloudStorage(facultyId, repoId, validFiles, currentUser!);
            await addFileDocsToDb(facultyId, repoId, validFiles, currentUser!);
            setFiles([...validFiles, ...files]);
        }
        setWait(false);
    }, [rawFileList]); // Re-initilized with a new function object reference every time new raw files are uploaded by the user

    useEffect(() => {
        handleLocalUpload();
    }, [handleLocalUpload]);
    return [files, setFiles, setRawFileList, filenameMemo, wait] as const;
};

function extractValidFiles(rawFileList: FileList, filenameMemo: FilenameMemo) {
    const validFiles: CustomFileList = [];
    for (let i = 0; i < rawFileList.length; i++) {
        const { name, type, size, lastModified } = rawFileList[i];
        if (!filenameMemo.current[name]) {
            // Only select the the files whose names do not exist in the current list of files => Avoid files with duplicate names
            filenameMemo.current[name] = true;
            validFiles.push({ name, size, type, lastModified, file: rawFileList[i] });
        }
    }
    return validFiles;
}

function uploadToCloudStorage(
    facultyId: string,
    repoId: string,
    validFiles: CustomFileList,
    currentUser: firebase.User
) {
    const storageRef = firebase.storage().ref();
    const dropboxRef = storageRef.child(`faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser.uid}`);
    return Promise.all(validFiles.map(({ name, file }) => dropboxRef.child(name).put(file)));
}

async function addFileDocsToDb(
    facultyId: string,
    repoId: string,
    validFiles: CustomFileList,
    currentUser: firebase.User
) {
    const reposRef = firebase.firestore().collection('repos');
    const dropboxesRef = reposRef.doc(repoId).collection('dropboxes');
    // First find the dropbox of this user in the faculty's repo. If no dropbox is found, add one for them.
    const querySnapshot = await dropboxesRef.where('ownerId', '==', currentUser.uid).get();
    const dropboxId = querySnapshot.empty
        ? (
              await dropboxesRef.add({
                  facultyId,
                  repoId,
                  status: 'pending',
                  ownerId: currentUser.uid,
                  ownerName: currentUser.displayName,
                  ownerEmail: currentUser.email,
                  created_at: firebase.firestore.FieldValue.serverTimestamp()
              })
          ).id
        : querySnapshot.docs[0].id;
    // then add a small list of uploaded files straight to this dropbox for easy reading
    const dropboxDocRef = dropboxesRef.doc(dropboxId);
    return Promise.all(
        validFiles.map(({ name }) => dropboxDocRef.update({ files: firebase.firestore.FieldValue.arrayUnion(name) }))
    );
}
