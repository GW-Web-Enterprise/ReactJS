import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { RepoSave } from '@app/typings/schemas';
import { AlertInfo } from '@app/typings/components';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const reposRef = firebase.firestore().collection('repos');
type Props = { facultyId: string };
export const FacultyReposMgt: VFC<Props> = ({ facultyId }) => {
    const [alertInfo, setAlertInfo] = useState<AlertInfo>(null);
    const addRepo = (data: RepoSave) => reposRef.add(data);
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!!alertInfo}
                autoHideDuration={6000}
                onClose={() => setAlertInfo(null)}
            >
                <Alert onClose={() => setAlertInfo(null)} severity={alertInfo?.status}>
                    {alertInfo?.message}
                </Alert>
            </Snackbar>
            <AddRepo facultyId={facultyId} onAdd={addRepo} setAlertInfo={setAlertInfo} />
        </Fragment>
    );
};
