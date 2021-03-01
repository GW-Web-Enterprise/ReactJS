import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import '@app/App.css';
import { CssBaseline } from '@material-ui/core';
import { ProvideAuth } from '@app/hooks/useAuth';
import { ApTemplate, ConsoleTemplate } from '@app/Templates';
import DateFnsUtils from '@date-io/date-fns';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <ProvideAuth>
                        <Switch>
                            <Route exact path="/ap" render={() => <Redirect to="/ap/login" />} />
                            <Route exact path="/console" render={() => <Redirect to="/console/overview" />} />
                            <Route path="/ap" component={ApTemplate} />
                            <Route path="/console" component={ConsoleTemplate} />
                        </Switch>
                    </ProvideAuth>
                </MuiPickersUtilsProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
