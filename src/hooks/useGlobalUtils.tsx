import {
    CircularProgress,
    Snackbar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { createContext, Dispatch, Fragment, ReactNode, SetStateAction, useContext, useRef, useState, VFC } from 'react';

type IGlobalUtilsContext = {
    showAlert: Dispatch<SetStateAction<AlertInfo>>;
    /** Show a loading icon with the passed in message. Drop in an empty string '' to turn off the loading */
    showLoading: Dispatch<SetStateAction<string>>;
    showDeleteDialog: Dispatch<SetStateAction<IDeleteDialog>>;
};
const GlobalUtilsContext = createContext({} as IGlobalUtilsContext);

export const useGlobalUtils = () => useContext(GlobalUtilsContext);

type AlertInfo = { status: 'success' | 'error'; message: string } | null;
type IDeleteDialog = {
    title: string;
    redMsg: string;
    content: string;
    handleDelete: () => void;
    /** Invoked when the Delete Dialog is closed */
    cleanup: () => void;
} | null;
export const ProvideGlobalUtils: VFC<{ children: ReactNode }> = ({ children }) => {
    const [alertInfo, showAlert] = useState<AlertInfo>(null);
    const [loadingMsg, showLoading] = useState('');
    const [deleteDialogParams, showDeleteDialog] = useState<IDeleteDialog>(null);
    // useRef() creates an object that will keep the same reference between renders
    // -> value will alway point to the same reference between rerender
    const staticMethods = useRef<IGlobalUtilsContext>({ showAlert, showLoading, showDeleteDialog });
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!!alertInfo}
                autoHideDuration={6000}
                onClose={() => showAlert(null)}
            >
                <Alert onClose={() => showAlert(null)} severity={alertInfo?.status}>
                    {alertInfo?.message}
                </Alert>
            </Snackbar>
            <Snackbar open={!!loadingMsg}>
                <Fragment>
                    <CircularProgress size={40} /> &nbsp; {loadingMsg}
                </Fragment>
            </Snackbar>
            <Dialog
                open={!!deleteDialogParams}
                onClose={() => {
                    showDeleteDialog(null);
                    deleteDialogParams?.cleanup();
                }}
            >
                <DialogTitle>{deleteDialogParams?.title}</DialogTitle>
                <DialogContent>
                    <Alert severity="error">{deleteDialogParams?.redMsg}</Alert>
                    <DialogContentText>{deleteDialogParams?.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            showDeleteDialog(null);
                            deleteDialogParams?.cleanup();
                        }}
                        color="primary"
                    >
                        Cancle
                    </Button>
                    <Button
                        onClick={() => {
                            deleteDialogParams?.handleDelete();
                            showDeleteDialog(null);
                        }}
                        variant="contained"
                        color="secondary"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <GlobalUtilsContext.Provider value={staticMethods.current}>{children}</GlobalUtilsContext.Provider>
        </Fragment>
    );
};
