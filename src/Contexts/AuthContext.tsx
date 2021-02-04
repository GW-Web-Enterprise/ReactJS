import React, { useContext, useState, useEffect, VFC, ReactNode } from 'react';
import { auth } from '../firebase';

// create a pipeline of data flowing from parent to deeply-nested children
const AuthContext = React.createContext({} as AuthContextInterface);
// When a component does not have a matching Provider above it in the tree, the default value is used

export const useAuth = () => useContext(AuthContext);
// return the current data in the AuthContext pipeline, which is the 'value' object in this case
// You can also use the Class.contextType or Context.Consumer API instead of useContext()

export const AuthProvider: VFC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<firebase.default.User>(null!);
    const [loading, setLoading] = useState(true);

    const signup: AuthFunc = (email, password) => auth.createUserWithEmailAndPassword(email, password);

    const loginSecretly = () => auth.signInAnonymously();

    const login: AuthFunc = (email, password) => auth.signInWithEmailAndPassword(email, password);

    const logout = () => auth.signOut();

    const resetPassword: ChangeCreFunc = (email) => auth.sendPasswordResetEmail(email);

    const updatePassword: ChangeCreFunc = (password) => currentUser.updatePassword(password);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user!);
            setLoading(false);
        });

        return unsubscribe; // invoked when the component is unmounted
    }, []);

    const value: AuthContextInterface = {
        currentUser,
        loginSecretly,
        login,
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
    /**
     * Login as guest without providing credentials
     */
    loginSecretly: () => Promise<firebase.default.auth.UserCredential>;
    login: AuthFunc;
    signup: AuthFunc;
    logout: () => Promise<void>;
    resetPassword: ChangeCreFunc;
    updatePassword: ChangeCreFunc;
}
