import React, { VFC } from 'react';
import { NavDrawer, PrivateRoute } from '../Components';
import { CMS_ROUTES } from '../routes';

export const CmsTemplate: VFC = () => {
    return (
        <NavDrawer>
            {CMS_ROUTES.map((routeProps, index) => (
                <PrivateRoute key={index} {...routeProps} />
            ))}
        </NavDrawer>
    );
};
