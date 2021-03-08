import { useMemoCompare } from '@app/hooks/useMemoCompare';
import firebase from 'firebase/app';
import { useEffect, useReducer } from 'react';

type QueryInfo =
    | { status: 'idle' | 'loading'; data: undefined; error: undefined }
    | { status: 'success'; data: Array<any>; error: undefined }
    | { status: 'error'; data: undefined; error: firebase.firestore.FirestoreError };
type ActionType =
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'success'; payload: Array<any> }
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
 * Accept a query reference
 * @description This hook subscribes/unsubscribes to real-time changes automatically,
 * imports firebase code, and abstract away the primitive React hooks (well, it does alot of things for you)
 * @example firebase.firestore().collection("cities").where("state", "==", "CA") // This refers to multiple docs
 */
export function useFirestoreQuery(query: firebase.firestore.Query) {
    const initialQueryState: QueryInfo = { status: query ? 'loading' : 'idle', data: undefined, error: undefined };
    const [queryState, dispatch] = useReducer(reducer, initialQueryState);

    const queryCached = useMemoCompare(query, prevQuery => prevQuery && query && query.isEqual(prevQuery));
    useEffect(() => {
        if (!queryCached) return dispatch({ type: 'idle' });
        dispatch({ type: 'loading' });

        return queryCached.onSnapshot(
            response => {
                const data = getCollectionData(response);
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

function getCollectionData(collection: firebase.firestore.QuerySnapshot): Array<any> {
    // A QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query
    // It's not an error if there is 0 documents matched by the query
    if (collection.empty) return [];
    return collection.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}
