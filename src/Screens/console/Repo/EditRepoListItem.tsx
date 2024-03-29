import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { RepoSaveDialog, RepoSaveFormData } from '@app/Screens/console/Repo/RepoSaveDialog';
import { RepoDbRead } from '@app/typings/schemas';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';

type EditRepoProps = { repoDoc: RepoDbRead; cleanup: () => void };
const reposRef = firebase.firestore().collection('repos');
export const EditRepoListItem: VFC<EditRepoProps> = ({ repoDoc: { id, ...rest }, cleanup }) => {
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
            <ListItem button onClick={() => setOpen(true)}>
                <ListItemIcon>
                    <Edit />
                </ListItemIcon>
                <ListItemText primary="Edit repo" />
            </ListItem>
            <RepoSaveDialog open={open} onClose={handleClose} onSubmit={handleSubmit} repoDoc={rest} />
        </Fragment>
    );
};
