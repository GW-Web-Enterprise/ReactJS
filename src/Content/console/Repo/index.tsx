import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { FacultySelector } from '@app/Content/console/Repo/FacultySelector';
import { AlertInfo } from '@app/typings/components';
import { RepoSave } from '@app/typings/schemas';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';

const reposRef = firebase.firestore().collection('repos');
export const Repo: VFC = () => {
    const [alertInfo, setAlertInfo] = useState<AlertInfo>(null);
    const [selectedFacultyId, setFacultyId] = useState('');
    const addRepo = (data: RepoSave) => reposRef.add(data);
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            {selectedFacultyId && (
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
                    <AddRepo facultyId={selectedFacultyId} onAdd={addRepo} setAlertInfo={setAlertInfo} />
                </Fragment>
            )}
        </Fragment>
    );
};
