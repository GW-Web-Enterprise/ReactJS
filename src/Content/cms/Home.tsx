import { VFC } from 'react';
import { useAuth } from '../../Contexts/AuthContext';

export const Home: VFC = () => {
    const { logout } = useAuth();
    return <div onClick={logout}>Welcome to the CMS homepage, click me to signout</div>;
};
