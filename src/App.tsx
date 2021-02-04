import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
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
                        <AccessPortal />;
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
