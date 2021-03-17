import { PopoverItem } from '@app/Components/PopoverItem';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
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
    TableBody,
    ListItemText,
    ListItemIcon
} from '@material-ui/core';
import { AssignmentTurnedIn, CancelSharp, GetApp, MoreVert } from '@material-ui/icons';

export const ReviewRepoRow: IRepoCollapsibleRow = ({ open }) => {
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Review dropboxes of students in the faculty
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Owner's name</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Owner's email</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Created at</strong>
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
                                        Bill Gates
                                    </TableCell>
                                    <TableCell align="right">billgates@gmail.com</TableCell>
                                    <TableCell align="right">
                                        {new Date('2021-02-08T14:22:12Z').toLocaleString()}
                                    </TableCell>
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
                                                        <ListItemText primary="Download to view" />
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <AssignmentTurnedIn />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Approve" />
                                                    </ListItem>
                                                    <ListItem button>
                                                        <ListItemIcon>
                                                            <CancelSharp />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Reject" />
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
