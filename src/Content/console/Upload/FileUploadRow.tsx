import { PopoverItem } from '@app/Components/PopoverItem';
import {
    Box,
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { CloudUpload, Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { VFC } from 'react';

type Props = { open: boolean };
export const FileUploadRow: VFC<Props> = ({ open }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Uploaded files
                        </Typography>
                        <Button variant="contained" size="small" startIcon={<CloudUpload />}>
                            Upload file
                        </Button>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Filename</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Created at</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Uploaded by</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Status</strong>
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        React Hooks
                                    </TableCell>
                                    <TableCell align="right">{new Date().toLocaleString()}</TableCell>
                                    <TableCell align="right">Bill Gates</TableCell>
                                    <TableCell align="right">Pending</TableCell>
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
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Edit />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Rename" />
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <Delete />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Delete" />
                                                    </ListItem>
                                                </List>
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
