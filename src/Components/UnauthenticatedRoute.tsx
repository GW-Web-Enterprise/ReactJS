import { VFC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { CustomRouteProps } from '../typings/routes';

/**
 * The component passed in here is only rendered if and only if the user is NOT logged in. Redirect to /console if the user is already authenticated
 */
export const UnauthenticatedRoute: VFC<CustomRouteProps> = ({ component: Component, ...routeProps }) => {
    const { currentUser } = useAuth();
    return (
        <Route
            {...routeProps}
            render={childProps => (currentUser ? <Redirect to="/console" /> : <Component {...childProps} />)}
        />
    );
};
