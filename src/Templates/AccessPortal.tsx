import React from 'react';
import { Grid } from '@material-ui/core';
import { accessPortalRoutes } from '../routes';
import { Route } from 'react-router-dom';

export const AccessPortal = () => {
    return (
        <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={6} lg={3} style={{ padding: '8px' }}>
                {accessPortalRoutes.map((routeProps, index) => (
                    <Route key={index} {...routeProps} />
                ))}
            </Grid>
        </Grid>
    );
};
