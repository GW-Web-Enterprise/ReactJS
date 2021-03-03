import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import { Fragment, VFC } from 'react';
import firebase from 'firebase/app';
import { LinearProgress } from '@material-ui/core';
import { FacultyRead } from '@app/typings/schemas';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';

const facultiesRef = firebase.firestore().collection('faculties');
export const Faculty: VFC = () => {
    const { data, status } = useFirestoreQuery(facultiesRef);
    return (
        <Fragment>
            {status === 'loading' && <LinearProgress />}
            {data && <AddFaculty numbFaculties={data.length} />}
            {status === 'success' &&
                data?.map(({ id, ...rest }: FacultyRead) => <FacultyListItem key={id} facultyDoc={{ id, ...rest }} />)}
        </Fragment>
    );
};
