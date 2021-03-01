import { AddRepo } from '@app/Content/console/Repo/AddRepo';
import { Fragment, VFC } from 'react';
import firebase from 'firebase/app';

const db = firebase.firestore();
type Props = { facultyId: string };
export const FacultyReposMgt: VFC<Props> = ({ facultyId }) => {
    return <Fragment>{facultyId && <AddRepo />}</Fragment>;
};
