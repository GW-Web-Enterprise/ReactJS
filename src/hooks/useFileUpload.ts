import { useAuth } from '@app/hooks/useAuth';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { CustomFileList } from '@app/typings/files';
import { getFileListSize } from '@app/utils/getFileListSize';
import firebase from 'firebase/app';
import { Dispatch, MutableRefObject, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

type FilenameMemo = MutableRefObject<{
    [key: string]: boolean;
}>;
// rawFileList in the file input's cache might contain invalid local files, the 'files' state only stores the valid ones
type SetRawFileList = Dispatch<SetStateAction<FileList>>;
type SetValidFiles = Dispatch<SetStateAction<CustomFileList>>;
type SetWaitMsg = Dispatch<SetStateAction<string>>;
export const useFileUpload = (
    fileInput: RefObject<HTMLInputElement>,
    facultyId: string,
    repoId: string,
    initialFiles: CustomFileList = []
) => {
    const filenameMemo: FilenameMemo = useRef<{ [key: string]: boolean }>({}); // memoize the filenames of the uploaded files
    const [rawFileList, setRawFileList] = useState<FileList>() as [FileList, SetRawFileList];
    const [files, setFiles] = useState<CustomFileList>(initialFiles) as [CustomFileList, SetValidFiles];
    const [wait, setWait] = useState('') as [string, SetWaitMsg];
    const { showAlert } = useGlobalUtils();
    const { currentUser } = useAuth();

    const handleLocalUpload = useCallback(async () => {
        if (!rawFileList || !fileInput.current?.files?.length) return;
        setWait('Uploading files, please wait...');
        const validFiles = extractValidFiles(rawFileList, filenameMemo);
        fileInput.current!.value = ''; // clear the cache of the file input after all valid files have been grabbed from it

        if (getFileListSize([...validFiles, ...files])[1] > Math.pow(10, 7)) {
            validFiles.forEach(({ name }) => delete filenameMemo.current[name]); // reset the filenameMemo to its original state on fail
            showAlert({
                status: 'error',
                message: 'Total file size is limited to 10 MB. Selected files cannot be uploaded'
            });
            return setWait('');
        }
        if (validFiles.length) {
            const uploadTasks = await uploadToCloudStorage(facultyId, repoId, validFiles, currentUser!);
            const uploadedFiles = uploadTasks.map(({ metadata }) => metadata);
            setFiles([...uploadedFiles, ...files]);
        }
        setWait('');
    }, [currentUser, facultyId, fileInput, files, rawFileList, repoId, showAlert]);
    // Re-initilized with a new function object reference if any variable in the dependency array changes
    // When file is renamed or deleted, the file input's cache is still empty -> fileInput.current.files.length = 0

    useEffect(() => {
        handleLocalUpload();
    }, [handleLocalUpload]);
    return [files, setFiles, setRawFileList, filenameMemo, wait, setWait] as const;
};

function extractValidFiles(rawFileList: FileList, filenameMemo: FilenameMemo) {
    const validFiles: Array<File> = [];
    [...rawFileList].forEach(file => {
        const { name } = file;
        if (/^[\w,\s-'’.]+\.[A-Za-z]{3,4}$/.test(name) && !filenameMemo.current[name]) {
            // Only select the the files whose names do not exist in the current list of files => Avoid files with duplicate names
            // Files with names that are not in the right format 'filename.ext' will be rejected
            filenameMemo.current[name] = true;
            validFiles.push(file);
        }
    });
    return validFiles;
}

function uploadToCloudStorage(facultyId: string, repoId: string, validFiles: File[], currentUser: firebase.User) {
    const storageRef = firebase.storage().ref();
    const dropboxRef = storageRef.child(`faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser.uid}`);
    return Promise.all(validFiles.map(file => dropboxRef.child(file.name).put(file)));
}
