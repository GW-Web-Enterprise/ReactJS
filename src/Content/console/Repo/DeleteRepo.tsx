import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { Fragment, VFC } from 'react';
import firebase from 'firebase/app';
import { ListItemText } from '@material-ui/core';

type DeleteRepoProps = { repoId: string; name: string; cleanup: () => void };
const reposRef = firebase.firestore().collection('repos');
export const DeleteRepo: VFC<DeleteRepoProps> = ({ repoId, name, cleanup }) => {
    const { showAlert, showDeleteDialog } = useGlobalUtils();
    const handleDelete = () =>
        reposRef
            .doc(repoId)
            .delete()
            .then(() => showAlert({ status: 'success', message: 'Repo deleted successfully' }))
            .catch(() => showAlert({ status: 'error', message: 'Failed to delete repo' }));
    return (
        <Fragment>
            <ListItemText
                primary="Delete repo"
                onClick={() =>
                    showDeleteDialog({
                        title: 'Delete Repo ?',
                        redMsg: `After you have deleted a repo, all of its files will be permanently deleted. Repos and their
                        files cannot be recovered.`,
                        content: `Repo: ${name}`,
                        handleDelete,
                        cleanup
                    })
                }
            />
        </Fragment>
    );
};
