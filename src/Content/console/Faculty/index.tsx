import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { FacultyDbRead } from '@app/typings/schemas';
import { LinearProgress, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import { Fragment, VFC } from 'react';

const facultiesRef = firebase.firestore().collection('faculties');
const Faculty: VFC = () => {
    const { data = [], status } = useFirestoreQuery(facultiesRef);
    return (
        <Fragment>
            {status === 'loading' && <LinearProgress />}
            {data && <AddFaculty numbFaculties={data.length} />}
            {status === 'success' && (
                <Fragment>
                    {data.map(({ id, ...rest }: FacultyDbRead) => (
                        <FacultyListItem key={id} facultyDoc={{ id, ...rest }} />
                    ))}
                    {!data.length && (
                        <Typography variant="body2">
                            Ouhh... it's empty in here. Create a faculty to see something
                        </Typography>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Faculty;
