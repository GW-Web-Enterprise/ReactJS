import { FULLNAME_INP_ERR } from '@app/constants/inputErrs';
import { InputProps } from '@app/typings/fields';
import { InputAdornment, TextField } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React, { VFC } from 'react';

export const FullnameField: VFC<InputProps> = ({ register }) => {
    return (
        <TextField
            inputRef={register(FULLNAME_INP_ERR)}
            label="Full Name"
            name="fullname"
            variant="outlined"
            margin="normal"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Person />
                    </InputAdornment>
                )
            }}
            fullWidth
            size="medium"
        />
    );
};
