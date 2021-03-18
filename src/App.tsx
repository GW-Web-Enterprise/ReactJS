import { Fragment, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import '@app/App.css';
import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core';
import { ProvideAuth } from '@app/hooks/useAuth';
import DateFnsUtils from '@date-io/date-fns';
import { ProvideGlobalUtils } from '@app/hooks/useGlobalUtils';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

if (process.env.REACT_APP_USE_EMULATOR) {
    firebase.firestore().useEmulator('localhost', 8080);
    firebase.functions().useEmulator('localhost', 5001);
}

const ApTemplate = lazy(() => import('@app/Templates/ApTemplate'));
const ConsoleTemplate = lazy(() => import('@app/Templates/ConsoleTemplate'));

function App() {
    return (
        <Fragment>
            <CssBaseline />
            <Router>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <ProvideGlobalUtils>
                        <ProvideAuth>
                            <Suspense
                                fallback={
                                    <Backdrop open={true} style={{ zIndex: 1201, color: '#fff' }}>
                                        <CircularProgress color="inherit" /> &nbsp; Loading content...
                                    </Backdrop>
                                }
                            >
                                <Switch>
                                    <Route exact path="/ap" render={() => <Redirect to="/ap/login" />} />
                                    <Route exact path="/console" render={() => <Redirect to="/console/overview" />} />
                                    <Route path="/ap" component={ApTemplate} />
                                    <Route path="/console" component={ConsoleTemplate} />
                                </Switch>
                            </Suspense>
                        </ProvideAuth>
                    </ProvideGlobalUtils>
                </MuiPickersUtilsProvider>
            </Router>
        </Fragment>
    );
}

export default App;
