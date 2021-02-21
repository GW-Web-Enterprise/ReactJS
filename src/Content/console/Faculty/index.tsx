import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import React, { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { Alert } from '@material-ui/lab';
import { FacultyRead, FacultySave } from '@app/typings/schemas';
import { AlertInfo } from '@app/typings/components';

const ref = firebase.firestore().collection('faculties');
export const Faculty: VFC = () => {
    const { data, status } = useFirestoreQuery(ref);
    const [alertInfo, setAlertInfo] = useState<AlertInfo>(null);

    const addFaculty = (data: FacultySave) => ref.add(data);
    const editFaculty = (id: string, data: FacultySave) => ref.doc(id).update(data)
    const deleteFaculty = (id: string) => ref.doc(id).delete();
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
            {status === 'loading' && <LinearProgress />}
            {/* Maximum number of faculties is 143 */}
            <AddFaculty onCreate={addFaculty} setAlertInfo={setAlertInfo} />
            {status === 'success' &&
                data?.map(({ id, name }: FacultyRead) => (
                    <FacultyListItem
                        key={id}
                        facultyId={id}
                        name={name}
                        onEdit={editFaculty}
                        onDelete={deleteFaculty}
                        setAlertInfo={setAlertInfo}
                    />
                ))}
        </Fragment>
    );
};
