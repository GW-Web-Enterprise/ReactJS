import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import React, { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { RepoRead } from '@app/typings/schemas';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert } from '@material-ui/icons';
import { PopoverItem } from '@app/Components/PopoverItem';
import { Alert } from '@material-ui/lab';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

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
                    renderPopContent={close => (
                        <List component="nav" dense>
                            <ListItem button>
                                <ListItemText primary="Edit repo" />
                            </ListItem>
                            <ListItem button>
                                <DeleteRepo repoId={id} name={name} cleanup={close} />
                            </ListItem>
                        </List>
                    )}
                />
            </TableCell>
        </TableRow>
    );
};

type DeleteRepoProps = { repoId: string; name: string; cleanup: () => void };
const DeleteRepo: VFC<DeleteRepoProps> = ({ repoId, name, cleanup }) => {
    const { showAlert } = useGlobalUtils();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        cleanup();
    };
    const handleDelete = () =>
        reposRef
            .doc(repoId)
            .delete()
            .then(() => showAlert({ status: 'success', message: 'Repo deleted successfully' }))
            .catch(() => showAlert({ status: 'error', message: 'Failed to delete repo' }))
            .then(handleClose);
    return (
        <Fragment>
            <ListItemText primary="Delete repo" onClick={handleOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Repo ?</DialogTitle>
                <DialogContent>
                    <Alert severity="error">
                        After you have deleted a repo, all of its files will be permanently deleted. Repos and their
                        files cannot be recovered.
                    </Alert>
                    <DialogContentText>{`Repo: ${name}`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancle
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
