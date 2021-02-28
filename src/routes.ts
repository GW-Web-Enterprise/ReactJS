// 🚨 The purpose of this file is to define different isolated independent contents rendered based on different routes
// All route props defined inside this file will be imported by the templates
import { ForgotPasswordForm } from '@app/Content/ap/ForgotPasswordForm';
import { LoginForm } from '@app/Content/ap/LoginForm';
import { SignUpForm } from '@app/Content/ap/SignUpForm';
import { Article } from '@app/Content/console/Article';
import { Faculty } from '@app/Content/console/Faculty';
import { Overview } from '@app/Content/console/Overview';
import { Repo } from '@app/Content/console/Repo';
import { CustomRouteProps } from '@app/typings/routes';

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
        component: Faculty
    },
    {
        path: '/console/repos',
        component: Repo
    },
    {
        path: '/console/articles',
        component: Article
    }
];
