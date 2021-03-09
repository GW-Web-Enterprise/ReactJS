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
