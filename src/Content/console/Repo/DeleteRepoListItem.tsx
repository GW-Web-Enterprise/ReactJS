import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { VFC } from 'react';
import firebase from 'firebase/app';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

type DeleteRepoProps = { repoId: string; name: string; cleanup: () => void };
const reposRef = firebase.firestore().collection('repos');
export const DeleteRepoListItem: VFC<DeleteRepoProps> = ({ repoId, name, cleanup }) => {
    const { showAlert, showDeleteDialog } = useGlobalUtils();
    const handleDelete = () =>
        reposRef
            .doc(repoId)
            .delete()
            .then(() => showAlert({ status: 'success', message: 'Repo deleted successfully' }))
            .catch(() => showAlert({ status: 'error', message: 'Failed to delete repo' }));
    return (
        <ListItem
            button
            onClick={() =>
                showDeleteDialog({
                    title: 'Delete repo',
                    redMsg: `After you have deleted a repo, all of its files will be permanently deleted. Repos and their
                files cannot be recovered.`,
                    content: `Repo: ${name}`,
                    handleDelete,
                    cleanup
                })
            }
        >
            <ListItemIcon>
                <Delete />
            </ListItemIcon>
            <ListItemText primary="Delete repo" />
        </ListItem>
    );
};
