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
    const closeTimestampMin = utils?.addDays(initialDate, 7); // Must give students at least 7 day to CUD
    const closeTimestampMax = utils?.addDays(initialDate, 120); // 120 days to CUD at max
    const [closeTimestamp, setcloseTimestamp] = useState(closeTimestampMin); // currently-selected value of closeTimestamp
    const finalTimestampMin = utils?.addDays(closeTimestamp!, 3); // Must give students at least 3 days to edit
    const finalTimestampMax = utils?.addDays(closeTimestamp!, 14); // 7 days to edit at max

    const handleClose = () => {
        setcloseTimestamp(closeTimestampMin);
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
                            name="closeTimestamp"
                            control={control}
                            defaultValue={closeTimestampMin}
                            render={({ ref, onChange, ...rest }) => (
                                <DateTimePicker
                                    margin="normal"
                                    variant="dialog"
                                    label="Close date and time"
                                    helperText="Students cannot submit or delete articles after this date and time (but can still edit the existing ones until the final date and time below)"
                                    autoOk
                                    disablePast={true}
                                    hideTabs
                                    minDate={closeTimestampMin}
                                    maxDate={closeTimestampMax}
                                    onChange={selected => {
                                        setcloseTimestamp(selected);
                                        onChange(selected);
                                    }}
                                    allowKeyboardControl={false}
                                    {...rest}
                                />
                            )}
                        />
                        <Controller
                            name="finalTimestamp"
                            control={control}
                            defaultValue={finalTimestampMin}
                            render={({ ref, ...rest }) => (
                                <DateTimePicker
                                    margin="normal"
                                    variant="dialog"
                                    label="Final date and time"
                                    minDate={finalTimestampMin}
                                    maxDate={finalTimestampMax}
                                    minDateMessage="Please repick the final date and time"
                                    maxDateMessage="Please repick the final date and time"
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
