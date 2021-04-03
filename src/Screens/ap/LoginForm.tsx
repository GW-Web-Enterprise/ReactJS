import { Box, Button, Link } from '@material-ui/core';
import { Fragment, useState, VFC } from 'react';
import firebase from 'firebase/app';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import googleLogo from '@app/assets/google-color.svg';
import { InlineIcon } from '@app/Components/InlineIcon';
import { EmailField } from '@app/Components/EmailField';
import { PasswordField } from '@app/Components/PasswordField';
import { useAuth } from '@app/hooks/useAuth';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

type Inps = { email: string; password: string };
const LoginForm: VFC = () => {
    const [loading, setLoading] = useState(false);
    const { loginWithGoogle, loginWithPassword } = useAuth();
    const { showAlert } = useGlobalUtils();
    const { register, handleSubmit, errors } = useForm<Inps>();
    const logUserIn = async ({ email, password }: Inps) => {
        setLoading(true);
        await loginWithPassword(email, password);
    };
    const onSubmit = (data: Inps) =>
        logUserIn(data).catch(async ({ code }) => {
            setLoading(false);
            const methods = await firebase.auth().fetchSignInMethodsForEmail(data.email);
            if (methods.length === 1 && methods[0] === 'google.com')
                return showAlert({
                    status: 'error',
                    message: `A Google account with the email ${data.email} already exists, please
                    login with this Google account or sign up for a new account with this email`
                });
            (code === 'auth/invalid-email' || code === 'auth/user-not-found') &&
                showAlert({ status: 'error', message: 'We cannot find an account with this email address' });
            code === 'auth/wrong-password' && showAlert({ status: 'error', message: 'Your password is incorrect' });
        });
    return (
        <Fragment>
            <Box mx="auto" mb={2} style={{ width: 'fit-content' }}>
                <Button
                    disabled={loading}
                    variant="outlined"
                    onClick={loginWithGoogle}
                    startIcon={<InlineIcon src={googleLogo} />}
                >
                    Continue with Google
                </Button>
            </Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                    Login
                </Button>
                <Box textAlign="center">
                    Or{' '}
                    <Link component={RouterLink} to="/ap/forgot-password">
                        Forgot Password
                    </Link>
                </Box>
                <Box textAlign="center" mt={3}>
                    {`Don't have an account? `}
                    <Link component={RouterLink} to="/ap/signup">
                        Sign up
                    </Link>
                </Box>
            </form>
        </Fragment>
    );
};

export default LoginForm;
