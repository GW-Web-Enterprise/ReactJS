import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { AccessPortal } from './Templates/AccessPortal';
import { AuthProvider } from './Contexts/AuthContext';
import { CssBaseline } from '@material-ui/core';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/ap/login" />} />
                        <AccessPortal />;
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
