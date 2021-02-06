import { Box, Button, Link } from '@material-ui/core';
import React, { useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { EmailField } from '../../Components';

export const ForgotPasswordForm: VFC = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, errors } = useForm<{ email: string }>();
    const onSubmit = (data: { email: string }) => {
        setLoading(true);
        console.log(data);
    };
    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <EmailField register={register} />
            {<Box color="error.main">{errors.email?.message}</Box>}
            <Button
                disabled={loading}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '8px 0' }}
            >
                Reset Password
            </Button>
            <Box textAlign="center">
                Or{' '}
                <Link component={RouterLink} to="/ap/login">
                    Log in
                </Link>
            </Box>
        </form>
    );
};
