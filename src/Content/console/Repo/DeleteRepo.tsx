import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemText
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

type DeleteRepoProps = { repoId: string; name: string; cleanup: () => void };
const reposRef = firebase.firestore().collection('repos');
export const DeleteRepo: VFC<DeleteRepoProps> = ({ repoId, name, cleanup }) => {
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
            .catch(() => showAlert({ status: 'error', message: 'Failed to delete repo' }));
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
