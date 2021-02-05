import React, { VFC } from 'react';
import { Grid } from '@material-ui/core';
import { ACCESS_PORTAL_ROUTES } from '../routes';
import { Route } from 'react-router-dom';

export const AccessPortalTemplate: VFC = () => {
    return (
        <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={6} lg={3}>
                {ACCESS_PORTAL_ROUTES.map((routeProps, index) => (
                    <Route key={index} {...routeProps} />
                ))}
            </Grid>
        </Grid>
    );
};
