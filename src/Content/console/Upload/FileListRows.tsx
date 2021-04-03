import { PopoverItem } from '@app/Components/PopoverItem';
import { FileRenameDialog } from '@app/Content/console/Upload/FileRenameDialog';
import { CustomFileList } from '@app/typings/files';
import { displayFileSize } from '@app/utils/displayFileSize';
import {
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TableCell,
    TableRow
} from '@material-ui/core';
import { Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { Dispatch, Fragment, MutableRefObject, SetStateAction, useEffect, useRef, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useAuth } from '@app/hooks/useAuth';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { LimitedBackdrop } from '@app/Components/LimitedBackdrop';
import { RepoDbRead } from '@app/typings/schemas';

type FileListRowsProps = {
    facultyId: string;
    repoDoc: RepoDbRead;
    /** A cache of all the filenames of the parent */
    filenameMemo: MutableRefObject<{
        [key: string]: boolean;
    }>;
    /** List of files from the parent */
    files: CustomFileList;
    /** Change the FileList state of the parent */
    setFiles: Dispatch<SetStateAction<CustomFileList>>;
};
const functions = firebase.app().functions('asia-southeast2');
export const FileListRows: VFC<FileListRowsProps> = ({ facultyId, repoDoc, filenameMemo, files, setFiles }) => {
    const { id: repoId, closeTimestamp, finalTimestamp } = repoDoc;
    const { currentUser } = useAuth();
    const { showAlert, showLoading } = useGlobalUtils();
    const trackLastestEdit = useRef({
        filenameToEdit: '',
        fileIndexToRename: Number.NEGATIVE_INFINITY
    }); // never gets re-initilized to default values on rerenders
    const dropbox = useRef(firebase.storage().ref(`faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser!.uid}`));
    const [downloadUrls, setDownloadUrls] = useState<Array<string>>([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        let ignore = false;
        (async function () {
            const urls: Array<string> = await Promise.all(
                files.map(({ name }) => dropbox.current.child(name).getDownloadURL())
            );
            if (!ignore) setDownloadUrls(urls);
        })();
        return () => {
            ignore = true;
        };
    }, [files]);
    if (!files.length) return null;
    const handleRename = async (newName: string) => {
        showLoading('Renaming...');
        const renameFile = functions.httpsCallable('default-renameFile');
        const { fileIndexToRename, filenameToEdit } = trackLastestEdit.current;
        if (newName === filenameToEdit) return setOpen(false);
        try {
            await renameFile({
                newName,
                path: {
                    facultyId,
                    repoId,
                    currentName: filenameToEdit
                }
            });
            const newFileList = files.slice();
            newFileList[fileIndexToRename].name = newName;
            delete filenameMemo.current[filenameToEdit];
            filenameMemo.current[newName] = true;
            setFiles(newFileList);
            showAlert({ status: 'success', message: 'File is renamed successfully' });
        } catch ({ message }) {
            showAlert({ status: 'error', message });
        }
        setOpen(false);
        showLoading('');
    };
    const handleDelete = async (indexToDelete: number) => {
        const { name } = files[indexToDelete];
        const deleteFile = functions.httpsCallable('default-deleteFile');
        try {
            await deleteFile({ facultyId, repoId, filename: name });
            delete filenameMemo.current[name];
            showAlert({ status: 'success', message: `'${name}' has been deleted successfully` });
            setFiles(files.filter((_file, index) => index !== indexToDelete));
        } catch ({ message }) {
            showAlert({ status: 'error', message });
        }
        showLoading('');
    };
    return (
        <Fragment>
            <FileRenameDialog
                open={open}
                onClose={() => setOpen(false)}
                filename={trackLastestEdit.current.filenameToEdit}
                onOkay={handleRename}
            />
            {files.map(({ name, size, updated, timeCreated }, index) => {
                return (
                    <TableRow key={name}>
                        <TableCell component="th" scope="row">
                            {name}
                        </TableCell>
                        <TableCell align="right">{displayFileSize(size)}</TableCell>
                        <TableCell align="right">{new Date(updated).toLocaleString()}</TableCell>
                        <TableCell align="right">{new Date(timeCreated).toLocaleString()}</TableCell>
                        <TableCell>
                            <PopoverItem
                                placement="bottomRight"
                                padding={0}
                                renderToggle={(toggle, toggleEl) => (
                                    <IconButton
                                        aria-label="View more options"
                                        size="small"
                                        onClick={toggle}
                                        ref={toggleEl}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                )}
                                renderPopContent={close => (
                                    <List component="nav" dense>
                                        <ListItem
                                            button
                                            component="a"
                                            href={downloadUrls[index]}
                                            target="_blank"
                                            onClick={() => {
                                                downloadUrls[index] && close();
                                            }}
                                        >
                                            {!downloadUrls[index] && (
                                                <LimitedBackdrop open={true}>
                                                    <CircularProgress size={30} /> &nbsp; <strong>Hang on...</strong>
                                                </LimitedBackdrop>
                                            )}
                                            <ListItemIcon>
                                                <GetApp />
                                            </ListItemIcon>
                                            <ListItemText primary="Download" />
                                        </ListItem>
                                        {firebase.firestore.Timestamp.now().valueOf() <= finalTimestamp.valueOf() && (
                                            <ListItem
                                                button
                                                onClick={() => {
                                                    trackLastestEdit.current.filenameToEdit = name;
                                                    trackLastestEdit.current.fileIndexToRename = index;
                                                    close();
                                                    setOpen(true);
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <Edit />
                                                </ListItemIcon>
                                                <ListItemText primary="Rename" />
                                            </ListItem>
                                        )}
                                        {firebase.firestore.Timestamp.now().valueOf() <= closeTimestamp.valueOf() && (
                                            <ListItem
                                                button
                                                onClick={() => {
                                                    showLoading('Deleting...');
                                                    close();
                                                    handleDelete(index);
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <Delete />
                                                </ListItemIcon>
                                                <ListItemText primary="Delete" />
                                            </ListItem>
                                        )}
                                    </List>
                                )}
                            />
                        </TableCell>
                    </TableRow>
                );
            })}
        </Fragment>
    );
};
