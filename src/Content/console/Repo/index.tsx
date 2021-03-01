import { FacultyReposMgt } from '@app/Content/console/Repo/FacultyReposMgt';
import { FacultySelector } from '@app/Content/console/Repo/FacultySelector';
import { Fragment, useState, VFC } from 'react';

export const Repo: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            <FacultyReposMgt facultyId={selectedFacultyId} />
        </Fragment>
    );
};
