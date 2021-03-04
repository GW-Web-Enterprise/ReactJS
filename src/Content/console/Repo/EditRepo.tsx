import { RepoSaveDialog, RepoSaveFormData } from '@app/Content/console/Repo/RepoSaveDialog';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { RepoDbRead } from '@app/typings/schemas';
import { ListItemText } from '@material-ui/core';
import { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';

type EditRepoProps = { repoDoc: RepoDbRead; cleanup: () => void };
const reposRef = firebase.firestore().collection('repos');
export const EditRepo: VFC<EditRepoProps> = ({ repoDoc: { id, ...rest }, cleanup }) => {
    const [open, setOpen] = useState(false);
    const { showAlert } = useGlobalUtils();
    const handleClose = () => {
        setOpen(false);
        cleanup();
    };
    const handleSubmit = (data: RepoSaveFormData) =>
        reposRef
            .doc(id)
            .update(data)
            .then(() => showAlert({ status: 'success', message: 'Repo edited successfully' }))
            .catch(() => showAlert({ status: 'error', message: 'Failed to edit repo' }))
            .then(handleClose);
    return (
        <Fragment>
            <ListItemText primary="Edit repo" onClick={() => setOpen(true)} />
            <RepoSaveDialog open={open} onClose={handleClose} onSubmit={handleSubmit} repoDoc={rest} />
        </Fragment>
    );
};
