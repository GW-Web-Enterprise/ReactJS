import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import React, { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FacultyRead } from '@app/typings/schemas';
import { AlertInfo } from '@app/typings/components';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';

const facultiesRef = firebase.firestore().collection('faculties');
export const Faculty: VFC = () => {
    const { data, status } = useFirestoreQuery(facultiesRef);
    const [alertInfo, setAlertInfo] = useState<AlertInfo>(null);

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
            {data && <AddFaculty setAlertInfo={setAlertInfo} numbFaculties={data.length} />}
            {status === 'success' &&
                data?.map(({ id, ...rest }: FacultyRead) => (
                    <FacultyListItem key={id} facultyDoc={{ id, ...rest }} setAlertInfo={setAlertInfo} />
                ))}
        </Fragment>
    );
};
