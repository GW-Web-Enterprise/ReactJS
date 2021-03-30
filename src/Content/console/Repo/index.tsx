import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { FacultySelector } from '@app/Components/FacultySelector';
import { RepoTable } from '@app/Components/RepoTable';
import { Fragment, useEffect, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { ReviewRow } from '@app/Content/console/Repo/ReviewRow';
import { getUserRole } from '@app/utils/getUserRole';
import { useAuth } from '@app/hooks/useAuth';

const Repo: VFC = () => {
    const { userRole } = useAuth();
    const [selectedFacultyId, setFacultyId] = useState('');
    const [query, setQuery] = useState<firebase.firestore.Query | null>(null);
    useEffect(() => {
        getQuery().then(setQuery);
    }, []);
    return (
        query && (
            <Fragment>
                <FacultySelector onSelect={setFacultyId} query={query} />
                {selectedFacultyId && (
                    <Fragment>
                        {userRole === 'admin' && <AddRepo facultyId={selectedFacultyId} />}
                        <RepoTable facultyId={selectedFacultyId} RepoCollapsibleRow={ReviewRow} />
                    </Fragment>
                )}
            </Fragment>
        )
    );
};

async function getQuery() {
    const userRole = await getUserRole();
    if (userRole === 'admin' || userRole === 'manager') return firebase.firestore().collection('faculties');
    return firebase
        .firestore()
        .collection('user_faculties')
        .where('userId', '==', firebase.auth().currentUser!.uid)
        .where('role', '==', 'coordinator');
}

export default Repo;
