import { LimitedBackdrop } from '@app/Components/LimitedBackdrop';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
import { FileListRows } from '@app/Content/console/Upload/FileListRows';
import { useAuth } from '@app/hooks/useAuth';
import { useFileUpload } from '@app/hooks/useFileUpload';
import { CustomFileList } from '@app/typings/files';
import { getFileListSize } from '@app/utils/getFileListSize';
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import firebase from 'firebase/app';
import { useCallback, useEffect, useRef } from 'react';

const storageRef = firebase.storage();
const db = firebase.firestore();
export const FileUploadRow: IRepoCollapsibleRow = ({ open, facultyId, repoId }) => {
    const fileInput = useRef<HTMLInputElement>(null);
    const { currentUser } = useAuth();
    const [files, setFiles, setRawFileList, filenameMemo, wait] = useFileUpload(fileInput, facultyId, repoId);
    const fetchFiles = useCallback(async () => {
        const dropboxesRef = db.collection('repos').doc(repoId).collection('dropboxes');
        // First find the dropbox for the logged-in user in the faculty's repo...
        const querySnapshot = await dropboxesRef.where('ownerId', '==', currentUser!.uid).get();
        // if no dropbox for the current user is found, create one for them (create on-demand)
        if (querySnapshot.empty) {
            await dropboxesRef.add({
                facultyId,
                repoId,
                status: 'pending',
                size: 0,
                ownerId: currentUser!.uid,
                ownerName: currentUser!.displayName,
                ownerEmail: currentUser!.email,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            // No dropbox -> no file -> terminate here
            return setFiles([]);
        }
        // Now we know for sure that the current user already has a dropbox...
        const pathToDropboxFiles = `faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser!.uid}`;
        const items = (await storageRef.ref(pathToDropboxFiles).listAll()).items;
        const tempFiles = (await Promise.all(items.map(item => item.getMetadata()))) as CustomFileList;
        tempFiles.forEach(({ name }) => (filenameMemo.current[name] = true));
        setFiles(tempFiles);
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, position: 'relative' }} colSpan={6}>
                {wait && (
                    <LimitedBackdrop open={true}>
                        <CircularProgress /> &nbsp; Uploading files, please wait...
                    </LimitedBackdrop>
                )}
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
                            Total size of uploaded files: {getFileListSize(files)[0]}
                        </Typography>
                        <input
                            type="file"
                            multiple
                            ref={fileInput}
                            accept="image/*, video/*, .pdf, .docx, .xlsx, .pptx, .txt, .zip , .zipx"
                            style={{ display: 'none' }}
                            // Invoke this when user has uploaded at least one file...
                            onChange={() => setRawFileList(fileInput.current!.files!)}
                        />
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Filename</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Size</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Last Modified</strong>
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
