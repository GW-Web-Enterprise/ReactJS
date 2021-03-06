import { PopoverItem } from '@app/Components/PopoverItem';
import { RepoTableHead } from '@app/Components/RepoTableHead';
import { RepoTableRow } from '@app/Components/RepoTableRow';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { RepoDbRead } from '@app/typings/schemas';
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
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

const Row: VFC<{ repoDoc: RepoDbRead }> = ({ repoDoc }) => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <RepoTableRow repoDoc={repoDoc} collapseOpen={open} toggleCollapse={() => setOpen(!open)} />
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
