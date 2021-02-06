import { VFC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { CustomRouteProps } from '../typings/routes';

/**
 * The component passed in here is private, rendered if and only if the user is logged in. Redirect to /ap/login if unauthenticated
 */
export const PrivateRoute: VFC<CustomRouteProps> = ({ component: Component, ...routeProps }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...routeProps}
            render={(childProps) => (currentUser ? <Component {...childProps} /> : <Redirect to="/ap/login" />)}
            // a 'render prop' is a function prop that receives data from another component and returns a component.
            // For example, the Route component here drops the data in the function prop and execute it
        />
    );
};
