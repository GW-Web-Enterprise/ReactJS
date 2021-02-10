import React, { useContext, useState, useEffect, VFC, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, GoogleAuthProvider } from '../firebase';

// create a pipeline of data flowing from parent to deeply-nested children
const AuthContext = React.createContext({} as AuthContextInterface);
// When a component does not have a matching Provider above it in the tree, the default value is used

export const useAuth = () => useContext(AuthContext);
// return the current data in the AuthContext pipeline, which is the 'value' object in this case
// You can also use the Class.contextType or Context.Consumer API instead of useContext()

export const AuthProvider: VFC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<firebase.default.User>(null!);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const signup: AuthFunc = (email, password) => auth.createUserWithEmailAndPassword(email, password);

    const lazyLogin = () => auth.signInAnonymously();

    const loginWithGoogle = () => auth.signInWithPopup(GoogleAuthProvider);

    const login: AuthFunc = (email, password) => auth.signInWithEmailAndPassword(email, password);

    const logout = () => auth.signOut();

    const resetPassword: ChangeCreFunc = (email) => auth.sendPasswordResetEmail(email);

    const updatePassword: ChangeCreFunc = (password) => currentUser.updatePassword(password);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user!);
            const currentPath = window.location.pathname;
            // If the user is logged in, then they must be at the system console
            if (user) if (!/^\/console/.test(currentPath)) history.push('/console/overview');
            // If the user is unauthenticated, then they must be at the access portal area
            if (!user) if (!/^\/ap/.test(currentPath)) history.push('/ap/login');
            setLoading(false); // Render content on login or logout
        });

        return unsubscribe; // invoked when the component is unmounted
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const value: AuthContextInterface = {
        currentUser,
        lazyLogin,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        updatePassword
    };
    // The child components subscribe to the AuthContext pipeline, re-render whenever the Provider’s 'value' prop changes
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

type AuthFunc = (email: string, password: string) => Promise<firebase.default.auth.UserCredential>;

type ChangeCreFunc = (newCredential: string) => Promise<void>;

interface AuthContextInterface {
    currentUser: firebase.default.User | null;
    lazyLogin: () => Promise<firebase.default.auth.UserCredential>;
    login: AuthFunc;
    loginWithGoogle: () => Promise<firebase.default.auth.UserCredential>;
    signup: AuthFunc;
    logout: () => Promise<void>;
    resetPassword: ChangeCreFunc;
    updatePassword: ChangeCreFunc;
}
