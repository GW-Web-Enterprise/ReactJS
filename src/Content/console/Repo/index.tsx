import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { FacultySelector } from '@app/Components/FacultySelector';
import { RepoTable } from '@app/Components/RepoTable';
import { Fragment, useState, VFC } from 'react';
import { ReviewRow } from '@app/Content/console/Repo/ReviewRow';

const Repo: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            {selectedFacultyId && (
                <Fragment>
                    <AddRepo facultyId={selectedFacultyId} />
                    <RepoTable facultyId={selectedFacultyId} RepoCollapsibleRow={ReviewRow} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Repo;
