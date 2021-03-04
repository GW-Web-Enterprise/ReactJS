import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { FacultyDbRead } from '@app/typings/schemas';
import { LinearProgress } from '@material-ui/core';
import firebase from 'firebase/app';
import { Fragment, VFC } from 'react';

const facultiesRef = firebase.firestore().collection('faculties');
export const Faculty: VFC = () => {
    const { data, status } = useFirestoreQuery(facultiesRef);
    return (
        <Fragment>
            {status === 'loading' && <LinearProgress />}
            {data && <AddFaculty numbFaculties={data.length} />}
            {status === 'success' &&
                data?.map(({ id, ...rest }: FacultyDbRead) => (
                    <FacultyListItem key={id} facultyDoc={{ id, ...rest }} />
                ))}
        </Fragment>
    );
};
