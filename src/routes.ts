import { ForgotPasswordForm, LoginForm, SignUpForm } from "./Content/ap";
import { Home } from "./Content/cms";
import { CustomRouteProps } from "./typings/routes";

// 🚨 The purpose of this file is to define different isolated independent contents rendered based on different routes
// All route props defined inside this file will be imported by the templates

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
]

// Each one will be mapped to <PrivateRoute>
export const CMS_ROUTES: Array<CustomRouteProps> = [
    {
        path: '/cms',
        component: Home
    }
]
