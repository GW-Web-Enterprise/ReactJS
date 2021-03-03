import { useEffect, useReducer } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useMemoCompare } from '@app/hooks/useMemoCompare';

type QueryInfo =
    | { status: 'idle' | 'loading'; data: undefined; error: undefined }
    | { status: 'success'; data: ResultDoc | undefined; error: undefined }
    | { status: 'error'; data: undefined; error: firebase.firestore.FirestoreError };
type ActionType =
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'success'; payload: ResultDoc | undefined }
    | { type: 'error'; payload: firebase.firestore.FirestoreError };

const reducer = (queryState: QueryInfo, action: ActionType): QueryInfo => {
    switch (action.type) {
        case 'idle':
            return { status: 'idle', data: undefined, error: undefined };
        case 'loading':
            return { status: 'loading', data: undefined, error: undefined };
        case 'success':
            return { status: 'success', data: action.payload, error: undefined };
        case 'error':
            return { status: 'error', data: undefined, error: action.payload };
        default:
            throw new Error('invalid action');
    }
};

/**
 * Accept a single doc reference
 * @example firebase.firestore().collection('cities').doc('SF') // This refers to a single doc
 */
export function useFirestoreDoc(query: firebase.firestore.DocumentReference) {
    const initialQueryState: QueryInfo = { status: query ? 'loading' : 'idle', data: undefined, error: undefined };
    const [queryState, dispatch] = useReducer(reducer, initialQueryState);

    const queryCached = useMemoCompare(query, prevQuery => prevQuery && query && query.isEqual(prevQuery));
    useEffect(() => {
        if (!queryCached) return dispatch({ type: 'idle' });
        dispatch({ type: 'loading' });

        return queryCached.onSnapshot(
            response => {
                const data = getDocData(response);
                dispatch({ type: 'success', payload: data });
            },
            err => {
                console.log(err);
                dispatch({ type: 'error', payload: err });
            }
        );
    }, [queryCached]);
    return queryState;
}

type ResultDoc = { id: string } & firebase.firestore.DocumentData;
function getDocData(doc: firebase.firestore.DocumentSnapshot): ResultDoc | undefined {
    // For a DocumentSnapshot that points to a non-existing document, doc.data() will return 'undefined'
    return doc.exists ? { id: doc.id, ...doc.data() } : undefined;
}
