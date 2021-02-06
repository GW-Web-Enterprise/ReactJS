import React, { VFC } from 'react';
import { Grid } from '@material-ui/core';
import { ACCESS_PORTAL_ROUTES } from '../routes';
import { UnauthenticatedRoute } from '../Components';

export const ApTemplate: VFC = () => {
    return (
        <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={6} lg={3} style={{ padding: '8px' }}>
                {ACCESS_PORTAL_ROUTES.map((routeProps, index) => (
                    <UnauthenticatedRoute key={index} {...routeProps} />
                ))}
            </Grid>
        </Grid>
    );
};
