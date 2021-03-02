export type FacultyRead = {
    id: string;
    name: string;
};

export type FacultySave = {
    name: string;
};

export type RepoSave = {
    name: string;
    facultyId: string;
    closeTimestamp: firebase.default.firestore.Timestamp;
    finalTimestamp: firebase.default.firestore.Timestamp;
    description?: string;
};
