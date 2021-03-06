import { PopoverItem } from '@app/Components/PopoverItem';
import { RepoTableHead } from '@app/Components/RepoTableHead';
import { DeleteRepo } from '@app/Content/console/Repo/DeleteRepo';
import { EditRepo } from '@app/Content/console/Repo/EditRepo';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { RepoDbRead } from '@app/typings/schemas';
import {
    Box,
    Collapse,
    IconButton,
    Link,
    List,
    ListItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert } from '@material-ui/icons';
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';

type RepoListProps = { facultyId: string };
const reposRef = firebase.firestore().collection('repos');
export const RepoList: VFC<RepoListProps> = ({ facultyId }) => {
    const { data = [], status } = useFirestoreQuery(reposRef.where('facultyId', '==', facultyId));
    return (
        <TableContainer component={Paper}>
            <Table>
                <RepoTableHead />
                <TableBody>
                    {status === 'success' &&
                        data.map((repoDoc: RepoDbRead) => <Row key={repoDoc.id} repoDoc={repoDoc} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

type RowProps = { repoDoc: RepoDbRead };
const Row: VFC<RowProps> = ({ repoDoc }) => {
    const [open, setOpen] = useState(false);
    const { id, name, description, closeTimestamp, finalTimestamp } = repoDoc;
    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="Toggle list of articles" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Tooltip title={description ?? ''} placement="bottom">
                        <Link component="button" variant="body2">
                            {name}
                        </Link>
                    </Tooltip>
                </TableCell>
                <TableCell align="right">{closeTimestamp.toDate().toLocaleString()}</TableCell>
                <TableCell align="right">{finalTimestamp.toDate().toLocaleString()}</TableCell>
                <TableCell>
                    <PopoverItem
                        placement="bottomRight"
                        padding={0}
                        renderToggle={(toggle, toggleEl) => (
                            <IconButton aria-label="View more options" size="small" onClick={toggle} ref={toggleEl}>
                                <MoreVert />
                            </IconButton>
                        )}
                        renderPopContent={close => (
                            <List component="nav" dense>
                                <ListItem button>
                                    <EditRepo repoDoc={repoDoc} cleanup={close} />
                                </ListItem>
                                <ListItem button>
                                    <DeleteRepo repoId={id} name={name} cleanup={close} />
                                </ListItem>
                            </List>
                        )}
                    />
                </TableCell>
            </TableRow>
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
        </Fragment>
    );
};
