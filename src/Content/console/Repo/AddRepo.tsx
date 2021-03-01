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
    const firstDeadlineMin = utils?.addDays(initialDate, 7); // At least 7 day to CUD
    const firstDeadlineMax = utils?.addDays(initialDate, 120); // 120 days to CUD at most
    const [firstDeadline, setFirstDeadline] = useState(firstDeadlineMin); // current selected value of 1st deadline
    const secondDeadlineMin = utils?.addDays(firstDeadline!, 3); // At least 3 days after the 1st deadline to edit
    const secondDeadlineMax = utils?.addDays(firstDeadline!, 7); // 7 days after the 1st deadline to edit at most
    const { control } = useForm();
    return (
        <Fragment>
            <ColorButton variant="contained" onClick={() => setDialogOpen(true)}>
                <InlineIcon src={repoIcon} />
                New Repo
            </ColorButton>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>New repo for faculty articles</DialogTitle>
                <DialogContent>
                    <Chip
                        avatar={<Avatar src={currentUser?.photoURL!} />}
                        label={`${currentUser?.displayName} (Owner)`}
                    />
                    <form noValidate autoComplete="off">
                        <TextField name="name" autoFocus margin="normal" label="Repo name" fullWidth />
                        {/* <Box color="error.main">{errors.name?.message}</Box> */}
                        <TextField name="description" margin="normal" label="Short description (optional)" fullWidth />
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
                            render={({ ref, value: _unused, ...rest }) => (
                                <DateTimePicker
                                    margin="normal"
                                    variant="dialog"
                                    label="Second deadline"
                                    value={secondDeadlineMin}
                                    minDate={secondDeadlineMin}
                                    maxDate={secondDeadlineMax}
                                    helperText="Students cannot edit their articles after the 2nd deadline"
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
