import { ForgotPasswordForm } from "./Content/AccessPortal/ForgotPasswordForm";
import { LoginForm } from "./Content/AccessPortal/LoginForm";
import { SignUpForm } from "./Content/AccessPortal/SignUpForm";
import { Home } from "./Content/CMS/Home";
import { CustomRouteProps } from "./typings/routes";

// 🚨 The purpose of this file is to define different isolated independent contents rendered based on different routes

// Each one is mapped to <AccessRoute>
export const accessPortalRoutes: Array<CustomRouteProps> = [
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
export const cmsRoutes: Array<CustomRouteProps> = [
    {
        path: '/cms',
        component: Home
    }
]
