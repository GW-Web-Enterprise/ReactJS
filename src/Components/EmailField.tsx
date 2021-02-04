import { InputAdornment, TextField } from '@material-ui/core';
import { Email } from '@material-ui/icons';
import React, { VFC } from 'react';
import { EMAIL_INP_ERR } from '../constants';
import { InputProps } from '../typings/fields';

export const EmailField: VFC<InputProps> = ({ register }) => {
    return (
        <TextField
            inputRef={register(EMAIL_INP_ERR)}
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Email />
                    </InputAdornment>
                )
            }}
            fullWidth
            size="medium"
        />
    );
};
