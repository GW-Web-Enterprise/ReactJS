import { PopoverItem } from '@app/Components/PopoverItem';
import { FileRenameDialog } from '@app/Content/console/Upload/FileRenameDialog';
import { CustomFileList } from '@app/typings/files';
import { displayFileSize } from '@app/utils/displayFileSize';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, TableCell, TableRow } from '@material-ui/core';
import { Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { Dispatch, Fragment, MutableRefObject, SetStateAction, useRef, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useAuth } from '@app/hooks/useAuth';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

type FileListRowsProps = {
    facultyId: string;
    repoId: string;
    /** A cache of all the filenames of the parent */
    filenameMemo: MutableRefObject<{
        [key: string]: boolean;
    }>;
    /** List of files from the parent */
    files: CustomFileList;
    /** Change the FileList state of the parent */
    setFiles: Dispatch<SetStateAction<CustomFileList>>;
};
export const FileListRows: VFC<FileListRowsProps> = ({ facultyId, repoId, filenameMemo, files, setFiles }) => {
    const { currentUser } = useAuth();
    const trackLastestEdit = useRef({
        filenameToEdit: '',
        fileIndexToRename: Number.NEGATIVE_INFINITY,
        closePopover: () => {}
    }); // never gets re-initilized to default values on rerenders
    const [open, setOpen] = useState(false);
    const { showAlert } = useGlobalUtils();
    if (!files.length) return null;
    const handleDialogClose = () => {
        setOpen(false);
        trackLastestEdit.current.closePopover();
    };
    const handleRename = (newName: string, oldName: string) => {
        const { fileIndexToRename } = trackLastestEdit.current;
        const newFileList = files.slice();
        newFileList[fileIndexToRename].name = newName;
        delete filenameMemo.current[oldName];
        filenameMemo.current[newName] = true;
        setFiles(newFileList);
        handleDialogClose();
    };
    const handleDelete = async (indexToDelete: number) => {
        const { name } = files[indexToDelete];
        delete filenameMemo.current[name];
        const pathToDropbox = `faculty_${facultyId}/repo_${repoId}/dropbox_${currentUser!.uid}`;
        await firebase.storage().ref(pathToDropbox).child(name).delete();
        showAlert({ status: 'success', message: `'${name}' has been deleted successfully` });
        setFiles(files.filter((_file, index) => index !== indexToDelete));
    };
    return (
        <Fragment>
            <FileRenameDialog
                open={open}
                onClose={handleDialogClose}
                filename={trackLastestEdit.current.filenameToEdit}
                onOkay={handleRename}
            />
            {files.map(({ name, size, updated, timeCreated }, i) => {
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
                                        <ListItem button component="a">
                                            <ListItemIcon>
                                                <GetApp />
                                            </ListItemIcon>
                                            <ListItemText primary="Download" />
                                        </ListItem>
                                        <ListItem button style={{ padding: 0 }}>
                                            <Box
                                                display="flex"
                                                onClick={() => {
                                                    trackLastestEdit.current.filenameToEdit = name;
                                                    trackLastestEdit.current.fileIndexToRename = i;
                                                    trackLastestEdit.current.closePopover = close;
                                                    setOpen(true);
                                                }}
                                                px={2}
                                                py={0.5}
                                            >
                                                <ListItemIcon>
                                                    <Edit />
                                                </ListItemIcon>
                                                <ListItemText primary="Rename" />
                                            </Box>
                                        </ListItem>
                                        <ListItem button style={{ padding: 0 }}>
                                            <Box
                                                display="flex"
                                                onClick={() => {
                                                    close();
                                                    handleDelete(i);
                                                }}
                                                px={2}
                                                py={0.5}
                                            >
                                                <ListItemIcon>
                                                    <Delete />
                                                </ListItemIcon>
                                                <ListItemText primary="Delete" />
                                            </Box>
                                        </ListItem>
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
