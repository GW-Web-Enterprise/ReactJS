import { PopoverItem } from '@app/Components/PopoverItem';
import { CustomFileList } from '@app/typings/files';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TableCell,
    TableRow,
    TextField
} from '@material-ui/core';
import { Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { Dispatch, Fragment, MutableRefObject, SetStateAction, useCallback, useRef, useState, VFC } from 'react';

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
export const FileRows: VFC<IFileRowProps> = ({ filenameMemo, files, setFiles }) => {
    const trackEdit = useRef({
        fileToEdit: { name: '', fileIndexToRename: Number.NEGATIVE_INFINITY },
        closePopover: () => {}
    }); // never gets re-initilized on rerenders
    const [open, setOpen] = useState(false);
    if (!files.length) return null;
    const handleDialogClose = () => {
        setOpen(false);
        trackEdit.current.closePopover();
    };
    const handleRename = (newName: string) => {
        // FIXME: filenameMemo isn't modified on rename
        const { fileIndexToRename } = trackEdit.current.fileToEdit;
        const newFileList = files.slice();
        newFileList[fileIndexToRename].name = newName;
        setFiles(newFileList);
        handleDialogClose();
    };
    const handleDelete = (fileIndexToRemove: number) => {
        delete filenameMemo.current[files[fileIndexToRemove].name];
        setFiles(files.filter((_file, index) => index !== fileIndexToRemove));
    };
    return (
        <Fragment>
            <RenameFileDialog
                open={open}
                onClose={handleDialogClose}
                filename={trackEdit.current.fileToEdit.name}
                onOkay={handleRename}
            />
            {files.map(({ name }, i) => {
                return (
                    <TableRow key={i}>
                        <TableCell component="th" scope="row">
                            {name}
                        </TableCell>
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
                                                    trackEdit.current.fileToEdit.name = name;
                                                    trackEdit.current.fileToEdit.fileIndexToRename = i;
                                                    trackEdit.current.closePopover = close;
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

type IRenameFileDialogProps = {
    open: boolean;
    onClose: () => void;
    onOkay: (newName: string) => void;
    filename: string;
};
const RenameFileDialog: VFC<IRenameFileDialogProps> = ({ open, onClose, filename, onOkay }) => {
    const [node, setNode] = useState<HTMLInputElement | null>(null);
    // This callback ref never gets re-initialized on re-render
    const onRefChange = useCallback(
        // Invoked with HTML DOM input element when the dialog is mounted
        // and invoked with null when dialog is unmounted
        (textInput: HTMLInputElement | null) => {
            setNode(textInput); // lift the text input up so that the onClick handler of the 'Ok' btn can access it
            textInput && textInput.setSelectionRange(0, filename.lastIndexOf('.'));
        },
        [filename]
    );
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle id="form-dialog-title">Rename</DialogTitle>
            <DialogContent>
                <TextField
                    name="name"
                    margin="dense"
                    autoFocus
                    fullWidth
                    inputRef={onRefChange}
                    defaultValue={filename}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancle</Button>
                <Button variant="contained" color="primary" onClick={() => onOkay(node!.value)}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
