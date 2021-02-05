import { ForgotPasswordForm } from "./Content/AccessPortal/ForgotPasswordForm";
import { LoginForm } from "./Content/AccessPortal/LoginForm";
import { SignUpForm } from "./Content/AccessPortal/SignUpForm";
import { Home } from "./Content/CMS/Home";
import { CustomRouteProps } from "./typings/routes";

// 🚨 The purpose of this file is to define different isolated independent contents rendered based on different routes
// All route props defined inside this file will be imported by the templates

// Each one is mapped to <AccessRoute>
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

// Each one is mapped to <PrivateRoute>
export const CMS_ROUTES: Array<CustomRouteProps> = [
    {
        path: '/cms',
        component: Home
    }
]
