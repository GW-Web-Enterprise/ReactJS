import { NavDrawer } from '@app/Components/NavDrawer';
import { PrivateRoute } from '@app/Components/PrivateRoute';
import { CONSOLE_ROUTES } from '@app/routes';
import React, { VFC } from 'react';

const ConsoleTemplate: VFC = () => {
    return (
        <NavDrawer>
            {CONSOLE_ROUTES.map((routeProps, index) => (
                <PrivateRoute key={index} {...routeProps} />
            ))}
        </NavDrawer>
    );
};

export default ConsoleTemplate;
