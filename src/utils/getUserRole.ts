import firebase from 'firebase/app';
export const getUserRole = async () => {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return 'guest';
    const { isAdmin, isManager } = (await currentUser.getIdTokenResult()).claims;
    if (isAdmin) return 'admin';
    if (isManager) return 'manager';
    return 'guest';
};
