import { FacultySelector } from '@app/Components/FacultySelector';
import { RepoTable } from '@app/Components/RepoTable';
import { FileUploadRow } from '@app/Content/console/Upload/FileUploadRow';
import { Fragment, useState, VFC } from 'react';

const Upload: VFC = () => {
    const [selectedFacultyId, setFacultyId] = useState('');
    return (
        <Fragment>
            <FacultySelector onSelect={setFacultyId} />
            {selectedFacultyId && <RepoTable facultyId={selectedFacultyId} CollapsibleRow={FileUploadRow} />}
        </Fragment>
    );
};

export default Upload;
