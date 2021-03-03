import {
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@material-ui/core';
import React, { useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { RepoRead } from '@app/typings/schemas';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert } from '@material-ui/icons';
import { PopoverItem } from '@app/Components/PopoverItem';

type RepoListProps = { facultyId: string };
const reposRef = firebase.firestore().collection('repos');
export const RepoList: VFC<RepoListProps> = ({ facultyId }) => {
    const { data = [], status } = useFirestoreQuery(reposRef.where('facultyId', '==', facultyId));
    return (
        <TableContainer component={Paper}>
            <Table style={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Repo name</TableCell>
                        <TableCell align="right">Close date and time</TableCell>
                        <TableCell align="right">Final date and time</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {status === 'success' &&
                        data.map((repoDoc: RepoRead) => <Row key={repoDoc.id} repoDoc={repoDoc} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

type RowProps = { repoDoc: RepoRead };
const Row: VFC<RowProps> = ({ repoDoc }) => {
    const [open, setOpen] = useState(false);
    const { id, name, description, closeTimestamp, finalTimestamp } = repoDoc;
    return (
        <TableRow key={id}>
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
                    renderPopContent={() => (
                        <List dense>
                            <ListItem button>
                                <ListItemText primary="Edit repo" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="Delete repo" />
                            </ListItem>
                        </List>
                    )}
                />
            </TableCell>
        </TableRow>
    );
};
