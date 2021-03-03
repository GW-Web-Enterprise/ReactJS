export type FacultyRead = {
    id: string;
    name: string;
};

export type FacultySave = {
    name: string;
};

export type RepoRead = {
    id: string;
    name: string;
    facultyId: string;
    closeTimestamp: firebase.default.firestore.Timestamp;
    finalTimestamp: firebase.default.firestore.Timestamp;
    description?: string;
};

export type RepoSave = Omit<RepoRead, 'id'>;
