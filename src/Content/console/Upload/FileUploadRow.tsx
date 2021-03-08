import { getSizeOfFiles } from '@app/utils/getSizeOfFiles';
import { Box, Button, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { useRef, useState } from 'react';
import firebase from 'firebase/app';
import { CustomFileList } from '@app/typings/files';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
import { FileListRows } from '@app/Content/console/Upload/FileListRows';
import { useAuth } from '@app/hooks/useAuth';

const reposRef = firebase.firestore().collection('repos');
const storageRef = firebase.storage().ref();

export const FileUploadRow: IRepoCollapsibleRow = ({ open, facultyId, repoId }) => {
    const { currentUser } = useAuth();
    const { showAlert, showLoading } = useGlobalUtils();
    const filenameMemo = useRef<{ [key: string]: boolean }>({}); // memoize the filenames of the uploaded files
    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<CustomFileList>([]);
    const [wait, setWait] = useState(false);
    const handleLocalUpload = async () => {
        setWait(true);
        showLoading('Uploading files, please wait...');
        // This function is invoked right after the user has uploaded at least one local file
        // File input is rendered so that the user can upload local files -> fileInput.current != null
        const validFiles: CustomFileList = [];
        const uploadedFiles = fileInput.current!.files!;
        for (let i = 0; i < uploadedFiles.length; i++) {
            const { name, type, size, lastModified } = uploadedFiles[i];
            if (!filenameMemo.current[name]) {
                filenameMemo.current[name] = true;
                validFiles.push({ name, size, type, lastModified, file: uploadedFiles[i] });
            }
        }
        fileInput.current!.value = ''; // clear the cache of file input after u have grabbed all the valid files from it
        if (getSizeOfFiles([...files, ...validFiles])[1] > Math.pow(10, 7)) {
            validFiles.forEach(({ name }) => delete filenameMemo.current[name]); // reset the filenameMemo to its original state on fail
            return showAlert({
                status: 'error',
                message: 'Total file size is limited to 10 MB. Selected files cannot be uploaded'
            });
        }
        // 📌 Total file sizes from client <= 10MB, now let's upload files in parallel to the Cloud Storage
        const pathToDropbox = `faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser!.uid}`;
        const dropboxStorageRef = storageRef.child(pathToDropbox);
        await Promise.all(validFiles.map(({ name, file }) => dropboxStorageRef.child(name).put(file)));

        // 📌 Add file docs in parallel to the dropbox doc
        const dropboxesDbRef = reposRef.doc(repoId).collection('dropboxes');
        // First find the dropbox of this user in the faculty's repo. If no dropbox is found, add one.
        const querySnapshot = await dropboxesDbRef.where('ownerId', '==', currentUser!.uid).get();
        const dropboxId = querySnapshot.empty
            ? (
                  await dropboxesDbRef.add({
                      facultyId,
                      repoId,
                      status: 'pending',
                      ownerId: currentUser!.uid,
                      ownerName: currentUser!.displayName,
                      ownerEmail: currentUser!.email,
                      created_at: firebase.firestore.FieldValue.serverTimestamp()
                  })
              ).id
            : querySnapshot.docs[0].id;
        // then add the uploaded files to this dropbox...
        const filesDbRef = dropboxesDbRef.doc(dropboxId).collection('files');
        await Promise.all(
            validFiles.map(({ name, size, lastModified }) =>
                filesDbRef.add({
                    name,
                    size,
                    facultyId,
                    repoId,
                    dropboxId,
                    ownerId: currentUser!.uid,
                    lastModified: firebase.firestore.Timestamp.fromDate(new Date(lastModified))
                })
            )
        );
        setWait(false);
        validFiles.length && setFiles([...validFiles, ...files]);
        showLoading('');
    };
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, position: 'relative' }} colSpan={6}>
                {wait && <div className="overlay" />}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom>
                            Your dropbox
                            <Box color="info.main" display="inline" fontSize="fontSize" ml={1}>
                                <strong>Status:</strong> pending
                            </Box>
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CloudUpload />}
                            onClick={() => fileInput.current?.click()}
                        >
                            Upload file
                        </Button>
                        <Typography variant="subtitle2" gutterBottom component="span" style={{ marginLeft: 8 }}>
                            Total size of uploaded files: {getSizeOfFiles(files)[0]}
                        </Typography>
                        <input
                            type="file"
                            multiple
                            ref={fileInput}
                            accept="image/*, video/*, .pdf, .docx, .xlsx, .pptx, .txt, .zip , .zipx"
                            style={{ display: 'none' }}
                            onChange={handleLocalUpload}
                        />
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Filename</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Uploaded at</strong>
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <FileListRows filenameMemo={filenameMemo} files={files} setFiles={setFiles} />
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
