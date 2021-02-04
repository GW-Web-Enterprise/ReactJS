import { Box, Button, Link } from '@material-ui/core';
import React, { Fragment, useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import googleLogo from '../../assets/google-color.svg';
import { EmailField, InlineIcon, PasswordField } from '../../Components';

type Inps = { email: string; password: string };

export const LoginForm: VFC = () => {
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
                    startIcon={<InlineIcon src={googleLogo} alt="Google logo" />}
                >
                    Continue with Google
                </Button>
            </Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <EmailField register={register} />
                {<Box color="error.main">{errors.email?.message}</Box>}
                <PasswordField register={register} />
                {<Box color="error.main">{errors.password?.message}</Box>}
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
