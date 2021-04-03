import { FacultySelector } from '@app/Components/FacultySelector';
import { RepoTable } from '@app/Components/RepoTable';
import { FileUploadRow } from '@app/Screens/console/Upload/FileUploadRow';
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';

const Upload: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector
                onSelect={setFacultyId}
                query={firebase
                    .firestore()
                    .collection('user_faculties')
                    .where('userId', '==', firebase.auth().currentUser!.uid)
                    .where('role', '==', 'student')}
            />
            {selectedFacultyId && <RepoTable facultyId={selectedFacultyId} RepoCollapsibleRow={FileUploadRow} />}
        </Fragment>
    );
};

export default Upload;
