import { useContext, useState, useEffect, VFC, ReactNode, createContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '@app/firebase-config.json';
import { getUserRole } from '@app/utils/getUserRole';

type SignUpFunc = (email: string, password: string, displayName: string) => Promise<void>;
type PasswordLoginFunc = (email: string, password: string) => Promise<firebase.auth.UserCredential>;
type ChangeCreFunc = (newCredential: string) => Promise<void>;
type UserRole = 'guest' | 'admin' | 'manager';
interface AuthContextInterface {
    currentUser: firebase.User | null;
    userRole: UserRole;
    lazyLogin: () => Promise<firebase.auth.UserCredential>;
    loginWithPassword: PasswordLoginFunc;
    loginWithGoogle: () => Promise<firebase.auth.UserCredential>;
    signup: SignUpFunc;
    logout: () => Promise<void>;
    resetPassword: ChangeCreFunc;
    updatePassword: ChangeCreFunc;
}

firebase.initializeApp(firebaseConfig.result.sdkConfig);
const auth = firebase.auth();
if (process.env.REACT_APP_USE_EMULATOR) auth.useEmulator('http://localhost:9099');

// create a pipeline of data flowing from parent to deeply-nested children
const AuthContext = createContext({} as AuthContextInterface);
// When a component does not have a matching Provider above it in the tree, the default value is used

export const useAuth = () => useContext(AuthContext);
// return the current data in the AuthContext pipeline
// You can also use the Class.contextType or Context.Consumer API instead of useContext()

export const ProvideAuth: VFC<{ children: ReactNode }> = ({ children }) => {
    const [newAuth, loading] = useProvideAuth();
    // The child components subscribe to the AuthContext pipeline, re-render whenever the Provider’s 'value' prop changes
    return <AuthContext.Provider value={newAuth}>{!loading && children}</AuthContext.Provider>;
};

function useProvideAuth() {
    const [currentUser, setCurrentUser] = useState<firebase.User>(null!);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRole>('guest');
    const history = useHistory();

    const signup: SignUpFunc = (email, password, displayName) =>
        auth.createUserWithEmailAndPassword(email, password).then(({ user }) => {
            // After account is created and user is logged in successfully...
            const functions = firebase.app().functions('asia-southeast2');
            const updateDuplicateProfile = functions.httpsCallable('default-updateDuplicateProfile');
            updateDuplicateProfile({ displayName });
            user!.updateProfile({ displayName });
        });

    const lazyLogin = () => auth.signInAnonymously();

    const loginWithGoogle = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    const loginWithPassword: PasswordLoginFunc = (email, password) => auth.signInWithEmailAndPassword(email, password);

    const logout = () => auth.signOut();

    const resetPassword: ChangeCreFunc = email =>
        auth.sendPasswordResetEmail(email, { url: 'https://gw-enterprise.web.app/ap/login' });

    const updatePassword: ChangeCreFunc = password => currentUser.updatePassword(password);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user!);
            getUserRole().then(setUserRole);
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
            userRole,
            lazyLogin,
            loginWithPassword,
            loginWithGoogle,
            signup,
            logout,
            resetPassword,
            updatePassword
        } as AuthContextInterface,
        loading
    ] as const;
}
