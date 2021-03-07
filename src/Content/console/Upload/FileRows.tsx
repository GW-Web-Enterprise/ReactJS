import { PopoverItem } from '@app/Components/PopoverItem';
import { CustomFileList } from '@app/typings/files';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, TableCell, TableRow } from '@material-ui/core';
import { Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { Dispatch, Fragment, MutableRefObject, SetStateAction, VFC } from 'react';

type Props = {
    /** A cache of all the filenames of the parent */
    filenameMemo: MutableRefObject<{
        [key: string]: boolean;
    }>;
    /** List of files from the parent */
    files: CustomFileList;
    /** Change the FileList state of the parent */
    setFiles: Dispatch<SetStateAction<CustomFileList>>;
};
export const FileRows: VFC<Props> = ({ filenameMemo, files, setFiles }) => {
    if (!files.length) return null;
    const handleRename = (fileIndexToRename: number) => {};
    const handleDelete = (fileIndexToRemove: number) => {
        delete filenameMemo.current[files[fileIndexToRemove].name];
        setFiles(files.filter((_file, index) => index !== fileIndexToRemove));
    };
    return (
        <Fragment>
            {files.map(({ name: filename }, i) => {
                const extDot = filename.lastIndexOf('.');
                const extension = filename.slice(extDot);
                filename = filename.slice(0, extDot);
                return (
                    <TableRow key={i}>
                        <TableCell component="th" scope="row">
                            {filename}
                        </TableCell>
                        <TableCell align="right">{extension}</TableCell>
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
                                            <Box display="flex" onClick={() => handleRename(i)} px={2} py={0.5}>
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
