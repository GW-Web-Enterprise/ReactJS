import React, { Fragment, useContext, useRef, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    withStyles
} from '@material-ui/core';
import repoIcon from '@app/assets/repo.svg';
import { InlineIcon } from '@app/Components/InlineIcon';
import { DateTimePicker, MuiPickersContext } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@app/hooks/useAuth';
import { REPO_DESC_ERR, REPO_NAME_ERR } from '@app/constants/inputErrs';

const ColorButton = withStyles(() => ({
    root: {
        color: '#ffffff',
        backgroundColor: '#2ea44f',
        '&:hover': {
            backgroundColor: '#2c974b'
        }
    }
}))(Button);

export const AddRepo = () => {
    const { currentUser } = useAuth();
    const utils = useContext(MuiPickersContext);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { current: initialDate } = useRef(new Date()); // Not re-initialized on re-render
    const firstDeadlineMin = utils?.addDays(initialDate, 7); // Must give students at least 7 day to CUD
    const firstDeadlineMax = utils?.addDays(initialDate, 120); // 120 days to CUD
    const [firstDeadline, setFirstDeadline] = useState(firstDeadlineMin); // current selected value of 1st deadline
    const secondDeadlineMin = utils?.addDays(firstDeadline!, 3); // Must give students at least 3 days to edit after the 1st deadline
    const secondDeadlineMax = utils?.addDays(firstDeadline!, 14); // 7 days to edit

    const handleClose = () => {
        setFirstDeadline(firstDeadlineMin);
        setDialogOpen(false);
    };
    const { control, handleSubmit, register, errors } = useForm();
    const onSubmit = (data: any) => {
        console.log(data);
    };
    return (
        <Fragment>
            <ColorButton variant="contained" onClick={() => setDialogOpen(true)}>
                <InlineIcon src={repoIcon} />
                New Repo
            </ColorButton>
            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>New repo for faculty articles</DialogTitle>
                <DialogContent>
                    <Chip
                        avatar={<Avatar src={currentUser?.photoURL!} />}
                        label={`${currentUser?.displayName} (Owner)`}
                    />
                    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            inputRef={register(REPO_NAME_ERR)}
                            name="name"
                            autoFocus
                            margin="normal"
                            label="Repo name"
                            fullWidth
                        />
                        <Box color="error.main">{errors.name?.message}</Box>
                        <TextField
                            inputRef={register(REPO_DESC_ERR)}
                            name="description"
                            margin="normal"
                            label="Short description (optional)"
                            fullWidth
                        />
                        <Box color="error.main">{errors.description?.message}</Box>
                        <Controller
                            name="First deadline"
                            control={control}
                            defaultValue={firstDeadlineMin}
                            render={({ ref, onChange, ...rest }) => (
                                <DateTimePicker
                                    margin="normal"
                                    variant="dialog"
                                    label="First deadline"
                                    helperText="Students cannot submit or delete articles after the 1st deadline (but can still edit the existing ones)"
                                    autoOk
                                    disablePast={true}
                                    hideTabs
                                    minDate={firstDeadlineMin}
                                    maxDate={firstDeadlineMax}
                                    onChange={selected => {
                                        setFirstDeadline(selected);
                                        onChange(selected);
                                    }}
                                    allowKeyboardControl={false}
                                    style={{ marginRight: '8px' }}
                                    {...rest}
                                />
                            )}
                        />
                        <Controller
                            name="Second deadline"
                            control={control}
                            defaultValue={secondDeadlineMin}
                            render={({ ref, ...rest }) => (
                                <DateTimePicker
                                    margin="normal"
                                    variant="dialog"
                                    label="Second deadline"
                                    minDate={secondDeadlineMin}
                                    maxDate={secondDeadlineMax}
                                    minDateMessage="Please repick the 2nd deadline"
                                    maxDateMessage="Please repick the 2nd deadline"
                                    autoOk
                                    disablePast={true}
                                    hideTabs
                                    allowKeyboardControl={false}
                                    {...rest}
                                />
                            )}
                        />
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '8px 0' }}
                        >
                            Create
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};
