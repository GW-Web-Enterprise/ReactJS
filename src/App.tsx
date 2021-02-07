import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './Contexts/AuthContext';
import { CssBaseline } from '@material-ui/core';
import { ApTemplate, ConsoleTemplate } from './Templates';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/ap/login" />} />
                        <Route path="/ap" component={ApTemplate} />
                        <Route path="/console" component={ConsoleTemplate} />
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
