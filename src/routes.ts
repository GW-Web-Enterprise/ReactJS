// 🚨 The purpose of this file is to define different isolated independent contents rendered based on different routes
// All route props defined inside this file will be imported by the templates

import { CustomRouteProps } from '@app/typings/routes';
import { lazy } from 'react';

const ForgotPasswordForm = lazy(() => import('@app/Content/ap/ForgotPasswordForm'));
const LoginForm = lazy(() => import('@app/Content/ap/LoginForm'));
const SignUpForm = lazy(() => import('@app/Content/ap/SignUpForm'));
const Upload = lazy(() => import('@app/Content/console/Upload'));
const Faculty = lazy(() => import('@app/Content/console/Faculty'));
const Overview = lazy(() => import('@app/Content/console/Overview'));
const Repo = lazy(() => import('@app/Content/console/Repo'));

// Each one will be mapped to <UnauthenticatedRoute>
export const ACCESS_PORTAL_ROUTES: Array<CustomRouteProps> = [
    {
        path: '/ap/signup',
        component: SignUpForm
    },
    {
        path: '/ap/login',
        component: LoginForm
    },
    {
        path: '/ap/forgot-password',
        component: ForgotPasswordForm
    }
];

// Each one will be mapped to <PrivateRoute>
export const CONSOLE_ROUTES: Array<CustomRouteProps> = [
    {
        path: '/console/overview',
        component: Overview
    },
    {
        path: '/console/faculties',
        component: Faculty,
        role: 'admin'
    },
    {
        path: '/console/repos',
        component: Repo
    },
    {
        path: '/console/upload',
        component: Upload
    }
];
