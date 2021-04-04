import { LimitedBackdrop } from '@app/Components/LimitedBackdrop';
import { PopoverItem } from '@app/Components/PopoverItem';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
import { STATUS_TO_JSX } from '@app/constants/dropboxStatus';
import { useAuth } from '@app/hooks/useAuth';
import { useFileUpload } from '@app/hooks/useFileUpload';
import { FileListRows } from '@app/Screens/console/Upload/FileListRows';
import { CustomFileList } from '@app/typings/files';
import { IDropboxDb } from '@app/typings/schemas';
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
    Tooltip,
    Typography
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import firebase from 'firebase/app';
import { Fragment, useEffect, useRef, useState } from 'react';

const storageRef = firebase.storage();
const db = firebase.firestore();
export const FileUploadRow: IRepoCollapsibleRow = ({ open, facultyId, repoDoc }) => {
    const { id: repoId, closeTimestamp } = repoDoc;
    const fileInput = useRef<HTMLInputElement>(null);
    const { currentUser } = useAuth();
    const [files, setFiles, setRawFileList, filenameMemo, wait, setWait] = useFileUpload(fileInput, facultyId, repoId);
    const [dropbox, setDropbox] = useState<IDropboxDb | null>(null);
    useEffect(() => {
        const dropboxesRef = db.collection('repos').doc(repoId).collection('dropboxes');
        (async function () {
            setWait('Loading files, please wait...');
            // First find the dropbox for the logged-in user in the faculty's repo...
            const querySnapshot = await dropboxesRef.where('ownerId', '==', currentUser!.uid).get();
            // if no dropbox for the current user is found, create one for them (create on-demand)
            if (querySnapshot.empty) {
                firebase.firestore.Timestamp.now().valueOf() <= closeTimestamp.valueOf() &&
                    (await dropboxesRef.add({
                        facultyId,
                        repoId,
                        status: 'pending',
                        size: 0,
                        ownerId: currentUser!.uid,
                        ownerName: currentUser!.displayName,
                        ownerEmail: currentUser!.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }));
                setWait('');
                // No dropbox -> no file -> terminate here
                return setFiles([]);
            }
            // Now we know for sure that the current user already has a dropbox...
            const pathToDropbox = `faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser!.uid}`;
            const items = (await storageRef.ref(pathToDropbox).listAll()).items;
            const tempFiles = (await Promise.all(items.map(item => item.getMetadata()))) as CustomFileList;
            tempFiles.forEach(({ name }) => (filenameMemo.current[name] = true));
            setWait('');
            setFiles(tempFiles);
            setDropbox(querySnapshot.docs[0].data() as IDropboxDb);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, facultyId, filenameMemo, setFiles, setWait]);

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, position: 'relative' }} colSpan={6}>
                {!!wait && (
                    <LimitedBackdrop open={true}>
                        <CircularProgress /> &nbsp; <strong>{wait}</strong>
                    </LimitedBackdrop>
                )}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {dropbox && (
                        <Box margin={1}>
                            {firebase.firestore.Timestamp.now().valueOf() > closeTimestamp.valueOf() && (
                                <Box color="info.main" display="inline" fontSize="fontSize" mt={1}>
                                    Close date and time of this repo has passed, therefore it is unable to accept any
                                    new file
                                </Box>
                            )}
                            <Typography variant="h6" gutterBottom>
                                Your dropbox
                                <PopoverItem
                                    placement="bottom"
                                    renderToggle={(toggle, toggleEl) => (
                                        <Button type="button" ref={toggleEl} onClick={toggle}>
                                            {STATUS_TO_JSX[dropbox?.status || 'pending']} &nbsp; (Click me to view more
                                            details)
                                        </Button>
                                    )}
                                    renderPopContent={() =>
                                        (dropbox && dropbox.status !== 'pending' && (
                                            <Fragment>
                                                <div>
                                                    <strong>Reviewer's name:</strong> {dropbox.reviewerName}
                                                </div>
                                                <div>
                                                    <strong>Reviewer's email:</strong> {dropbox.reviewerEmail}
                                                </div>
                                                <div>
                                                    <strong>At:</strong> {dropbox.reviewedAt?.toDate().toLocaleString()}
                                                </div>
                                                <div style={{ whiteSpace: 'pre-line' }}>
                                                    <strong>Feedback:</strong> {dropbox.feedback}
                                                </div>
                                            </Fragment>
                                        )) ||
                                        'No one has reviewed this dropbox'
                                    }
                                />
                            </Typography>
                            {firebase.firestore.Timestamp.now().valueOf() <= closeTimestamp.valueOf() && (
                                <Tooltip
                                    title={`Only files with valid names are uploaded. Valid characters include: english character,
                                        space, digit, hyphen, underscore, comma, single quote, apostrophe, dot, exclamation mark,
                                        paranthesis, plus)`}
                                    arrow
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<CloudUpload />}
                                        onClick={() => fileInput.current!.click()}
                                    >
                                        Upload file
                                    </Button>
                                </Tooltip>
                            )}
                            <Typography variant="subtitle2" gutterBottom component="span" style={{ marginLeft: 8 }}>
                                Total size of uploaded files: {getFileListSize(files)[0]} (limited to 10 MB)
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
                                    <FileListRows
                                        facultyId={facultyId}
                                        repoDoc={repoDoc}
                                        filenameMemo={filenameMemo}
                                        files={files}
                                        setFiles={setFiles}
                                    />
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
