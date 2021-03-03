import {
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@material-ui/core';
import React, { VFC } from 'react';
import firebase from 'firebase/app';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { RepoRead } from '@app/typings/schemas';

type Props = { facultyId: string };

const reposRef = firebase.firestore().collection('repos');
export const RepoList: VFC<Props> = ({ facultyId }) => {
    const { data = [], status } = useFirestoreQuery(reposRef.where('facultyId', '==', facultyId));
    return (
        <TableContainer component={Paper}>
            <Table style={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Repo name</TableCell>
                        <TableCell align="right">Close date and time</TableCell>
                        <TableCell align="right">Final date and time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {status === 'success' &&
                        data.map(({ id, name, description, closeTimestamp, finalTimestamp }: RepoRead) => (
                            <TableRow key={id}>
                                <TableCell component="th" scope="row">
                                    <Tooltip title={description ?? 'none'} placement="bottom">
                                        <Link component="button" variant="body2">
                                            {name}
                                        </Link>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">{closeTimestamp.toDate().toLocaleString()}</TableCell>
                                <TableCell align="right">{finalTimestamp.toDate().toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
