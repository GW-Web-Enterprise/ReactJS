import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { FacultySelector } from '@app/Components/FacultySelector';
import { RepoTable } from '@app/Components/RepoTable';
import { Fragment, useState, VFC } from 'react';
import { ReviewRepoRow } from '@app/Content/console/Repo/ReviewRepoRow';

const Repo: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            {selectedFacultyId && (
                <Fragment>
                    <AddRepo facultyId={selectedFacultyId} />
                    <RepoTable facultyId={selectedFacultyId} CollapsibleRow={ReviewRepoRow} />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Repo;
