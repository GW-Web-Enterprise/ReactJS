import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './Contexts/AuthContext';
import { CssBaseline } from '@material-ui/core';
import { ApTemplate, CmsTemplate } from './Templates';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/ap/login" />} />
                        <Route path="/ap" component={ApTemplate} />
                        <Route path="/cms" component={CmsTemplate} />
                    </Switch>
                </AuthProvider>
            </Router>
        </React.Fragment>
    );
}

export default App;
