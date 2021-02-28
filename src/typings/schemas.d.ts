export type FacultyRead = {
    id: string;
    name: string;
} & firebase.firestore.DocumentData;

export type FacultySave = {
    name: string;
} & firebase.firestore.DocumentData;
