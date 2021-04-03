import { EmailField } from '@app/Components/EmailField';
import { FullnameField } from '@app/Components/FullnameField';
import { PasswordField } from '@app/Components/PasswordField';
import { useAuth } from '@app/hooks/useAuth';
import { Box, Button, Link } from '@material-ui/core';
import { useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

type Inps = { email: string; password: string; fullname: string };

const SignUpForm: VFC = () => {
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const { showAlert, showActionBar } = useGlobalUtils();
    const { register, handleSubmit, errors } = useForm<Inps>();
    const createUser = async ({ email, password, fullname }: Inps) => {
        setLoading(true);
        await signup(email, password, fullname);
        showAlert({ status: 'success', message: 'Account is created successfully' });
    };
    const linkToGoogleAcc = async (email: string, password: string) => {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        const { user } = await loginWithGoogle();
        if (user!.email !== email)
            return showAlert({
                status: 'error',
                message: 'Failed to link account because you login with a different email address'
            });
        await user!.linkWithCredential(credential);
        showAlert({
            status: 'success',
            message: 'Account is linked successfully, you can use this email and password to login from now on'
        });
    };
    const onSubmit = (data: Inps) =>
        createUser(data).catch(async err => {
            const { code } = err;
            const { email, password } = data;
            setLoading(false);
            if (code === 'auth/email-already-in-use') {
                if ((await firebase.auth().fetchSignInMethodsForEmail(email)).length === 2)
                    return showAlert({
                        status: 'error',
                        message: `An account already exists with the e-mail ${email}`
                    });
                showActionBar({
                    message: 'A Google account with this email address already exists',
                    hint: 'Link account now',
                    actionFunc: () => linkToGoogleAcc(email, password)
                });
            }
            code === 'auth/invalid-email' && showAlert({ status: 'error', message: 'Email is invalid' });
        });
    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FullnameField register={register} />
            <Box color="error.main">{errors.fullname?.message}</Box>
            <EmailField register={register} />
            <Box color="error.main">{errors.email?.message}</Box>
            <PasswordField register={register} />
            <Box color="error.main">{errors.password?.message}</Box>
            <Button
                disabled={loading}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '8px 0' }}
            >
                Sign Up
            </Button>
            <Box textAlign="center" mt={3}>
                {`Already have an account? `}
                <Link component={RouterLink} to="/ap/login">
                    Log In
                </Link>
            </Box>
        </form>
    );
};

export default SignUpForm;
