import { PopoverItem } from '@app/Components/PopoverItem';
import { ICollapsibleRow } from '@app/Components/RepoTable';
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Table,
    TableBody
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

export const ReviewRepoRow: ICollapsibleRow = ({ open }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Review files uploaded from students in the faculty
                        </Typography>
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
                                                    <ListItem button>Download to view</ListItem>
                                                    <ListItem button>Approve</ListItem>
                                                    <ListItem button>Reject</ListItem>
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
