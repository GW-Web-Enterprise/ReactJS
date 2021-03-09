import { PopoverItem } from '@app/Components/PopoverItem';
import { FileRenameDialog } from '@app/Content/console/Upload/FileRenameDialog';
import { CustomFileList } from '@app/typings/files';
import { displayFileSize } from '@app/utils/displayFileSize';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, TableCell, TableRow } from '@material-ui/core';
import { Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { Dispatch, Fragment, MutableRefObject, SetStateAction, useRef, useState, VFC } from 'react';

type IFileRowProps = {
    /** A cache of all the filenames of the parent */
    filenameMemo: MutableRefObject<{
        [key: string]: boolean;
    }>;
    /** List of files from the parent */
    files: CustomFileList;
    /** Change the FileList state of the parent */
    setFiles: Dispatch<SetStateAction<CustomFileList>>;
};
export const FileListRows: VFC<IFileRowProps> = ({ filenameMemo, files, setFiles }) => {
    const trackLastestEdit = useRef({
        filenameToEdit: '',
        fileIndexToRename: Number.NEGATIVE_INFINITY,
        closePopover: () => {}
    }); // never gets re-initilized to default values on rerenders
    const [open, setOpen] = useState(false);
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
    const handleDelete = (fileIndexToRemove: number) => {
        delete filenameMemo.current[files[fileIndexToRemove].name];
        setFiles(files.filter((_file, index) => index !== fileIndexToRemove));
    };
    return (
        <Fragment>
            <FileRenameDialog
                open={open}
                onClose={handleDialogClose}
                filename={trackLastestEdit.current.filenameToEdit}
                onOkay={handleRename}
            />
            {files.map(({ name, size, lastModified }, i) => {
                return (
                    <TableRow key={i}>
                        <TableCell component="th" scope="row">
                            {name}
                        </TableCell>
                        <TableCell align="right">{displayFileSize(size)}</TableCell>
                        <TableCell align="right">{new Date(lastModified).toLocaleString()}</TableCell>
                        <TableCell align="right">{new Date().toLocaleString()}</TableCell>
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
                                        <ListItem button>
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
