import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import React, { MouseEvent, useState, VFC } from 'react';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { PASSWORD_INP_ERR } from '@app/constants/inputErrs';
import { InputProps } from '@app/typings/fields';

export const PasswordField: VFC<InputProps> = ({ register }) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();
    return (
        <TextField
            inputRef={register(PASSWORD_INP_ERR)}
            label="Password"
            name="password"
            margin="normal"
            variant="outlined"
            fullWidth
            size="medium"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Lock />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={togglePassword} onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};
