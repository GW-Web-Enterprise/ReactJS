import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { FacultyListItem } from '@app/Content/console/Faculty/FacultyListItem';
import { cloneComponent } from '@app/utils/cloneComponent';
import React, { Fragment, VFC } from 'react';

export const Faculty: VFC = () => {
    return (
        <Fragment>
            <AddFaculty />
            {cloneComponent(10)(<FacultyListItem />)}
        </Fragment>
    );
};
