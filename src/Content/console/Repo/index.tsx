import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { FacultySelector } from '@app/Content/console/Repo/FacultySelector';
import { RepoList } from '@app/Content/console/Repo/RepoList';
import { Fragment, useState, VFC } from 'react';

const Repo: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            {selectedFacultyId && (
                <Fragment>
                    <AddRepo facultyId={selectedFacultyId} />
                    <RepoList facultyId={selectedFacultyId} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Repo;
