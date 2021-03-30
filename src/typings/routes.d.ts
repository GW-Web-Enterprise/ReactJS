import { RouteComponentProps, RouteProps } from 'react-router-dom';

export interface CustomRouteProps extends RouteProps {
    /** typeof React.Component works with JSX.Element, which is actually the return type of the 'render prop' in react-router <Route>
     *  The union React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> support React.VFC<P = {}>
     */
    component: typeof React.Component | React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path: string;
    /** The role that can access this route */
    role?: string;
}
