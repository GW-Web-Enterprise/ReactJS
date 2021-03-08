import { Fragment, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import '@app/App.css';
import { CircularProgress, CssBaseline } from '@material-ui/core';
import { ProvideAuth } from '@app/hooks/useAuth';
import DateFnsUtils from '@date-io/date-fns';
import { ProvideGlobalUtils } from '@app/hooks/useGlobalUtils';
import 'firebase/firestore';
import 'firebase/storage';

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
                            <Suspense fallback={<CircularProgress />}>
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
