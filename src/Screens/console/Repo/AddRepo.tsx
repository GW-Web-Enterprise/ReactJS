import repoIcon from '@app/assets/repo.svg';
import { InlineIcon } from '@app/Components/InlineIcon';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { RepoSaveDialog, RepoSaveFormData } from '@app/Screens/console/Repo/RepoSaveDialog';
import { RepoDbSave } from '@app/typings/schemas';
import { Button, withStyles } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { Fragment, useState, VFC } from 'react';

const ColorButton = withStyles(() => ({
    root: {
        color: '#ffffff',
        backgroundColor: '#2ea44f',
        '&:hover': {
            backgroundColor: '#2c974b'
        }
    }
}))(Button);

type Props = {
    facultyId: string;
};
const reposRef = firebase.firestore().collection('repos');
export const AddRepo: VFC<Props> = ({ facultyId }) => {
    const [open, setOpen] = useState(false);
    const { showAlert } = useGlobalUtils();
    const handleClose = () => setOpen(false);
    const handleSubmit = (data: RepoSaveFormData) => {
        const repoToSave: RepoDbSave = {
            ...data,
            closeTimestamp: firebase.firestore.Timestamp.fromDate(data.closeTimestamp),
            finalTimestamp: firebase.firestore.Timestamp.fromDate(data.finalTimestamp),
            facultyId: facultyId
        };
        reposRef
            .add(repoToSave)
            .then(() => showAlert({ status: 'success', message: 'Repo created successfully' }))
            .catch(() => () => showAlert({ status: 'error', message: 'Failed to create repo' }))
            .then(handleClose);
    };
    return (
        <Fragment>
            <ColorButton variant="contained" onClick={() => setOpen(true)}>
                <InlineIcon src={repoIcon} />
                New Repo
            </ColorButton>
            <RepoSaveDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />
        </Fragment>
    );
};
