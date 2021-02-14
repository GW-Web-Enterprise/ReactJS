import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { CssBaseline } from '@material-ui/core';
import { AuthProvider } from '@app/Contexts/AuthContext';
import { ApTemplate, ConsoleTemplate } from './Templates';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Switch>
                        <Route exact path="/ap" render={() => <Redirect to="/ap/login" />} />
                        <Route exact path="/console" render={() => <Redirect to="/console/overview" />} />
                        <Route path="/ap" component={ApTemplate} />
                        <Route path="/console" component={ConsoleTemplate} />
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
