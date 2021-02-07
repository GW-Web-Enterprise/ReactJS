import React, { VFC } from 'react';
import { NavDrawer, PrivateRoute } from '../Components';
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
