import { RouteProps } from "react-router-dom";
import { ForgotPasswordForm } from "./Content/AccessPortal/ForgotPasswordForm";
import { LoginForm } from "./Content/AccessPortal/LoginForm";
import { SignUpForm } from "./Content/AccessPortal/SignUpForm";

export const accessPortalRoutes: Array<RouteProps> = [
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

export const cmsRoutes: Array<RouteProps> = [
    {
        path: '/cms'
    }
]
