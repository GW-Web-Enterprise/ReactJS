import { EmailField } from '@app/Components/EmailField';
import { useAuth } from '@app/hooks/useAuth';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { Box, Button, Link } from '@material-ui/core';
import { useState, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useHistory } from 'react-router-dom';

const ForgotPasswordForm: VFC = () => {
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const { showAlert } = useGlobalUtils();
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm<{ email: string }>();
    const onSubmit = async ({ email }: { email: string }) => {
        setLoading(true);
        await resetPassword(email);
        history.push('/ap/login');
        showAlert({ status: 'success', message: 'Email is sent successfully, please check your inbox' });
    };
    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <EmailField register={register} />
            <Box color="error.main">{errors.email?.message}</Box>
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

export default ForgotPasswordForm;
