import { PopoverItem } from '@app/Components/PopoverItem';
import { useAuth } from '@app/hooks/useAuth';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { DeleteRepoListItem } from '@app/Screens/console/Repo/DeleteRepoListItem';
import { EditRepoListItem } from '@app/Screens/console/Repo/EditRepoListItem';
import { RepoDbRead } from '@app/typings/schemas';
import {
    IconButton,
    Link,
    List,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert } from '@material-ui/icons';
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';

type RepoTableProps = { facultyId: string; RepoCollapsibleRow: IRepoCollapsibleRow };
const reposRef = firebase.firestore().collection('repos');
export const RepoTable: VFC<RepoTableProps> = ({ facultyId, RepoCollapsibleRow }) => {
    const { userRole } = useAuth();
    const { data = [], status } = useFirestoreQuery(reposRef.where('facultyId', '==', facultyId));
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {/* The 1st column holds the button to toggle the visibility of the repo list  */}
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Repo name</strong>
                        </TableCell>
                        <TableCell align="right">
                            <strong>Close date and time</strong>
                        </TableCell>
                        <TableCell align="right">
                            <strong>Final date and time</strong>
                        </TableCell>
                        {/* The last column holds the button to edit and delete a repo */}
                        {window.location.pathname === '/console/repos' && userRole === 'admin' && (
                            <TableCell></TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {status === 'success' &&
                        data.map((repoDoc: RepoDbRead) => (
                            <RepoRow
                                key={repoDoc.id}
                                facultyId={facultyId}
                                repoDoc={repoDoc}
                                RepoCollapsibleRow={RepoCollapsibleRow}
                            />
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export type IRepoCollapsibleRow = VFC<{ open: boolean; facultyId: string; repoDoc: RepoDbRead }>;
type RepoRowProps = {
    facultyId: string;
    repoDoc: RepoDbRead;
    /** A collapsible row with the prop 'open' */
    RepoCollapsibleRow: IRepoCollapsibleRow;
};
const RepoRow: VFC<RepoRowProps> = ({ facultyId, repoDoc, RepoCollapsibleRow }) => {
    const { userRole } = useAuth();
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
                {window.location.pathname === '/console/repos' &&
                    userRole === 'admin' && ( // UI components to edit and delete a repo
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
                                        <EditRepoListItem repoDoc={repoDoc} cleanup={close} />
                                        <DeleteRepoListItem repoId={id} name={name} cleanup={close} />
                                    </List>
                                )}
                            />
                        </TableCell>
                    )}
            </TableRow>
            <RepoCollapsibleRow open={open} facultyId={facultyId} repoDoc={repoDoc} />
        </Fragment>
    );
};
