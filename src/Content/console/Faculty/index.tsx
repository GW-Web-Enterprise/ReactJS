import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import React, { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FacultyRead, FacultySave } from '@app/typings/schemas';
import { AlertInfo } from '@app/typings/components';
import { useFireStoreQuery } from '@app/hooks/useFireStoreQuery';

const ref = firebase.firestore().collection('faculties');
export const Faculty: VFC = () => {
    const { data, status } = useFireStoreQuery(ref);
    const [alertInfo, setAlertInfo] = useState<AlertInfo>(null);

    const addFaculty = ({ name, ...props }: FacultySave) => ref.add({ name: name.toLowerCase(), ...props });
    const editFaculty = (id: string, { name, ...props }: FacultySave) =>
        ref.doc(id).update({ name: name.toLowerCase(), ...props });
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
            {data && <AddFaculty onCreate={addFaculty} setAlertInfo={setAlertInfo} numbFaculties={data?.length} />}
            {status === 'success' &&
                data &&
                data.map(({ id, name }: FacultyRead) => (
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
