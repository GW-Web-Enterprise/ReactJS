export type ISysuserDb = {
    id: string;
    photoURL: string;
    email: string;
    displayName: string;
};

export type IFacultyMemberDb = ISysuserDb & { role: string };

export type FacultyDbRead = {
    id: string;
    name: string;
};

export type FacultyDbSave = {
    name: string;
};

export type RepoDbRead = {
    id: string;
    name: string;
    facultyId: string;
    closeTimestamp: firebase.default.firestore.Timestamp;
    finalTimestamp: firebase.default.firestore.Timestamp;
    description?: string;
};

export type RepoDbSave = Omit<RepoDbRead, 'id'>;

export type DropboxDb = {
    id: string;
    facultyId: string;
    repoId: string;
    status: 'pending' | 'approved' | 'rejected';
    size: 0;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    created_at: firebase.default.firestore.Timestamp;
};
