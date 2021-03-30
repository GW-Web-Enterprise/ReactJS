import { useAuth } from '@app/hooks/useAuth';
import { CustomRouteProps } from '@app/typings/routes';
import { VFC } from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * The component passed in here is private, rendered if and only if the user is logged in. Redirect to /ap/login if unauthenticated
 */
export const PrivateRoute: VFC<CustomRouteProps> = ({ component: Component, role, ...routeProps }) => {
    const { currentUser, userRole } = useAuth();
    return (
        <Route
            {...routeProps}
            render={childProps => {
                if (role)
                    if (userRole === role) {
                        return <Component {...childProps} />;
                    } else return <Redirect to="/console/overview" />;
                if (currentUser) {
                    return <Component {...childProps} />;
                } else return <Redirect to="/ap/login" />;
            }}
            // a 'render prop' is a function prop that receives data from another component and returns a component.
            // For example, the Route component here drops the data in the function prop and execute it
        />
    );
};
