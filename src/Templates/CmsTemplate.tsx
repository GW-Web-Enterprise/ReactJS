import React, { Fragment, VFC } from 'react';
import { PrivateRoute } from '../Components';
import { CMS_ROUTES } from '../routes';

export const CmsTemplate: VFC = () => {
    return (
        <Fragment>
            {CMS_ROUTES.map((routeProps, index) => (
                <PrivateRoute key={index} {...routeProps} />
            ))}
        </Fragment>
    );
};
