import { AddFaculty } from '@app/Content/console/Faculty/AddFaculty';
import { ViewFaculty } from '@app/Content/console/Faculty/ViewFaculty';
import { cloneComponent } from '@app/utils/cloneComponent';
import React, { Fragment, VFC } from 'react';

export const Faculty: VFC = () => {
    return (
        <Fragment>
            <AddFaculty />
            {cloneComponent(10)(<ViewFaculty />)}
        </Fragment>
    );
};
