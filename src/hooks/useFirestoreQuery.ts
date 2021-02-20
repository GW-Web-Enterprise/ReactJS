import { useEffect, useReducer } from "react";
import firebase from 'firebase/app'
import 'firebase/firestore';
import { useMemoCompare } from "@app/hooks/useMemoCompare";

type QueryInfo =
    | { status: 'idle' | 'loading', data: undefined, error: undefined }
    | { status: 'success', data: Array<ResultDoc> | ResultDoc | undefined, error: undefined }
    | { status: 'error', data: undefined, error: firebase.firestore.FirestoreError }
type ActionType =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success"; payload: Array<ResultDoc> | ResultDoc | undefined }
    | { type: "error"; payload: firebase.firestore.FirestoreError }

const reducer = (state: QueryInfo, action: ActionType): QueryInfo => {
    switch (action.type) {
        case "idle":
            return { status: "idle", data: undefined, error: undefined };
        case "loading":
            return { status: "loading", data: undefined, error: undefined };
        case "success":
            return { status: "success", data: action.payload, error: undefined };
        case "error":
            return { status: "error", data: undefined, error: action.payload };
        default:
            throw new Error("invalid action");
    }
}

// Query could accept a single doc reference firebase.firestore.DocumentReference: firebase.firestore().collection('cities').doc('SF')
// Or a query reference firebase.firestore.Query: firebase.firestore().collection("cities").where("state", "==", "CA")
export function useFirestoreQuery(query: firebase.firestore.Query) {
    const initialState: QueryInfo = { status: query ? "loading" : "idle", data: undefined, error: undefined };
    const [state, dispatch] = useReducer(reducer, initialState)

    const queryCached = useMemoCompare(query, (prevQuery) => prevQuery && query && query.isEqual(prevQuery))
    useEffect(() => {
        if (!queryCached) return dispatch({ type: "idle" });
        dispatch({ type: "loading" });

        return queryCached.onSnapshot(
            response => {
                const data = response.docs ? getCollectionData(response) : getDocData(response as unknown as firebase.firestore.DocumentSnapshot)
                dispatch({ type: "success", payload: data });
            },
            error => dispatch({ type: "error", payload: error })
        );

    }, [queryCached]);
    return state;
}

type ResultDoc = { id: string } & firebase.firestore.DocumentData
function getDocData(doc: firebase.firestore.DocumentSnapshot): ResultDoc | undefined {
    // For a DocumentSnapshot that points to a non-existing document, doc.data() will return 'undefined'
    return doc.exists ? { id: doc.id, ...doc.data() } : undefined;
}

function getCollectionData(collection: firebase.firestore.QuerySnapshot): Array<ResultDoc> {
    // A QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query
    // It's not an error if there is 0 documents matched by the query
    if (collection.empty) return []
    return collection.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
}
