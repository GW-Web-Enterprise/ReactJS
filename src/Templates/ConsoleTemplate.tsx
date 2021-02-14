import { NavDrawer } from '@app/Components/NavDrawer';
import { PrivateRoute } from '@app/Components/PrivateRoute';
import React, { VFC } from 'react';
import { CONSOLE_ROUTES } from '../routes';

export const ConsoleTemplate: VFC = () => {
    return (
        <NavDrawer>
            {CONSOLE_ROUTES.map((routeProps, index) => (
                <PrivateRoute key={index} {...routeProps} />
            ))}
        </NavDrawer>
    );
};
