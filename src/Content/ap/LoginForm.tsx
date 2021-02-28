import { Box, Button, Link } from '@material-ui/core';
import React, { Fragment, useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import googleLogo from '@app/assets/google-color.svg';
import { InlineIcon } from '@app/Components/InlineIcon';
import { EmailField } from '@app/Components/EmailField';
import { PasswordField } from '@app/Components/PasswordField';
import { useAuth } from '@app/hooks/useAuth';

type Inps = { email: string; password: string };
export const LoginForm: VFC = () => {
    const { loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, errors } = useForm<Inps>();
    const onSubmit = (data: Inps) => {
        setLoading(true);
        console.log(data);
    };
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
