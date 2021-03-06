import React, { useContext, useState, useEffect, VFC, ReactNode, createContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

type AuthFunc = (email: string, password: string) => Promise<firebase.auth.UserCredential>;
type ChangeCreFunc = (newCredential: string) => Promise<void>;
interface AuthContextInterface {
    currentUser: firebase.User | null;
    lazyLogin: () => Promise<firebase.auth.UserCredential>;
    login: AuthFunc;
    loginWithGoogle: () => Promise<firebase.auth.UserCredential>;
    signup: AuthFunc;
    logout: () => Promise<void>;
    resetPassword: ChangeCreFunc;
    updatePassword: ChangeCreFunc;
}

firebase.initializeApp({
    apiKey: 'AIzaSyBzHQIRDVJooBCRmF30kwrmU2o6OE4q2rQ',
    authDomain: 'gw-enterprise.firebaseapp.com',
    projectId: 'gw-enterprise',
    storageBucket: 'gw-enterprise.appspot.com',
    messagingSenderId: '268992275771',
    appId: '1:268992275771:web:78231566281d6a84fb831e',
    measurementId: 'G-BNDJYP9MPL'
});
const auth = firebase.auth();

// create a pipeline of data flowing from parent to deeply-nested children
const AuthContext = createContext({} as AuthContextInterface);
// When a component does not have a matching Provider above it in the tree, the default value is used

export const useAuth = () => useContext(AuthContext);
// return the current data in the AuthContext pipeline
// You can also use the Class.contextType or Context.Consumer API instead of useContext()

export const ProvideAuth: VFC<{ children: ReactNode }> = ({ children }) => {
    const [auth, loading] = useProvideAuth();
    // The child components subscribe to the AuthContext pipeline, re-render whenever the Provider’s 'value' prop changes
    return <AuthContext.Provider value={auth}>{!loading && children}</AuthContext.Provider>;
};

function useProvideAuth() {
    const [currentUser, setCurrentUser] = useState<firebase.User>(null!);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const signup: AuthFunc = (email, password) => auth.createUserWithEmailAndPassword(email, password);

    const lazyLogin = () => auth.signInAnonymously();

    const loginWithGoogle = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    const login: AuthFunc = (email, password) => auth.signInWithEmailAndPassword(email, password);

    const logout = () => auth.signOut();

    const resetPassword: ChangeCreFunc = email => auth.sendPasswordResetEmail(email);

    const updatePassword: ChangeCreFunc = password => currentUser.updatePassword(password);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user!);
            const currentPath = window.location.pathname;
            // If the user is logged in, then they must be at the system console
            if (user) if (!/^\/console/.test(currentPath)) history.push('/console/overview');
            // If the user is unauthenticated, then they must be at the access portal area
            if (!user) if (!/^\/ap/.test(currentPath)) history.push('/ap/login');
            setLoading(false); // Render content only when all the tasks above are complete
        });

        return unsubscribe; // invoked when the component is unmounted
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return [
        {
            currentUser,
            lazyLogin,
            login,
            loginWithGoogle,
            signup,
            logout,
            resetPassword,
            updatePassword
        } as AuthContextInterface,
        loading
    ] as const;
}
