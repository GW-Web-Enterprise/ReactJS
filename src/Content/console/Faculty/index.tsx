import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { ManageFaculty } from '@app/Content/console/Faculty/ManageFaculty';
import { cloneComponent } from '@app/utils/cloneComponent';
import React, { Fragment, VFC } from 'react';

export const Faculty: VFC = () => {
    return (
        <Fragment>
            <AddFaculty />
            {cloneComponent(10)(<ManageFaculty />)}
        </Fragment>
    );
};
