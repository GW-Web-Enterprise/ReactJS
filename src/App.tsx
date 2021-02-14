import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
                        <Route path="/ap" component={ApTemplate} />
                        <Route path="/console" component={ConsoleTemplate} />
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
