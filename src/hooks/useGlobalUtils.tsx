import { CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { createContext, Dispatch, Fragment, ReactNode, SetStateAction, useContext, useRef, useState, VFC } from 'react';

type IGlobalUtilsContext = {
    showAlert: Dispatch<SetStateAction<AlertInfo>>;
    /** Show a loading icon with the passed in message. Drop in an empty string '' to turn off the loading */
    showLoading: Dispatch<SetStateAction<string>>;
};
const GlobalUtilsContext = createContext({} as IGlobalUtilsContext);

export const useGlobalUtils = () => useContext(GlobalUtilsContext);

type AlertInfo = { status: 'success' | 'error'; message: string } | null;
export const ProvideGlobalUtils: VFC<{ children: ReactNode }> = ({ children }) => {
    const [alertInfo, showAlert] = useState<AlertInfo>(null);
    const [loadingMsg, showLoading] = useState('');
    // useRef() creates an object that will keep the same reference between renders
    // -> value will alway point to the same reference between rerender
    const staticMethods = useRef<IGlobalUtilsContext>({ showAlert, showLoading });
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
            <GlobalUtilsContext.Provider value={staticMethods.current}>{children}</GlobalUtilsContext.Provider>
        </Fragment>
    );
};
