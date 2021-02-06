import React, { VFC } from 'react';
import { DrawerNav, PrivateRoute } from '../Components';
import { CMS_ROUTES } from '../routes';

export const CmsTemplate: VFC = () => {
    return (
        <DrawerNav>
            {CMS_ROUTES.map((routeProps, index) => (
                <PrivateRoute key={index} {...routeProps} />
            ))}
        </DrawerNav>
    );
};
