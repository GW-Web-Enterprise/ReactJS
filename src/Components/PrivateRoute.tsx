import { Component, VFC } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

interface PrivateProps extends RouteProps {
    /**
     * Accept a factory that produces a component and NOT the product/instance of that factory. Instantiate by calling <Component/>.
     * The syntax 'typeof Component' is a shorthand for 'new() => Component<any, any>', this refers to the subclass components that extend
     * the base class React.Component<P, S, SS>.
     */
    component: typeof Component;
}

/**
 * The passed component is private, rendered if and only if the user is logged in. Redirect to /ap/login if unauthenticated
 */
export const Private: VFC<PrivateProps> = ({ component: Component, ...routeProps }) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...routeProps}
            render={(childProps) => (currentUser ? <Component {...childProps} /> : <Redirect to="/login" />)}
            // a 'render prop' is a function prop that receives data from another component and returns a component.
            // For example, the Route component here drops the data in the function prop and execute it
        ></Route>
    );
};
