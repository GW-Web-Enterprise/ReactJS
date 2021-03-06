import { EmailField } from '@app/Components/EmailField';
import { FullnameField } from '@app/Components/FullnameField';
import { PasswordField } from '@app/Components/PasswordField';
import { Box, Button, Link } from '@material-ui/core';
import React, { useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

type Inps = { email: string; password: string; fullname: string };

const SignUpForm: VFC = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, errors } = useForm<Inps>();
    const onSubmit = (data: Inps) => {
        setLoading(true);
        console.log(data);
    };
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
