import { REPO_DESC_ERR, REPO_NAME_ERR } from '@app/constants/inputErrs';
import { useAuth } from '@app/hooks/useAuth';
import { RepoDbSave } from '@app/typings/schemas';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    TextField
} from '@material-ui/core';
import { DateTimePicker, MuiPickersContext } from '@material-ui/pickers';
import { useContext, useState, VFC } from 'react';
import { Controller, useForm } from 'react-hook-form';

export type RepoSaveFormData = { name: string; closeTimestamp: Date; finalTimestamp: Date; description?: string };
type Props = {
    repoDoc?: RepoDbSave;
    onSubmit: (data: RepoSaveFormData) => void;
} & Pick<DialogProps, 'open' | 'onClose'>;
export const RepoSaveDialog: VFC<Props> = ({ onSubmit, repoDoc, ...dialogProps }) => {
    const defaultCloseTs = !repoDoc ? null : repoDoc.closeTimestamp.toDate();
    const defaultFinalTs = !repoDoc ? null : repoDoc.finalTimestamp.toDate();
    const [closeTimestamp, setcloseTimestamp] = useState<Date | null>(defaultCloseTs);
    const { currentUser } = useAuth();
    const utils = useContext(MuiPickersContext);
    const { control, handleSubmit, register, errors } = useForm<RepoSaveFormData>();
    const now = new Date();
    return (
        <Dialog {...dialogProps}>
            <DialogTitle>New repo for faculty articles</DialogTitle>
            <DialogContent>
                <Chip avatar={<Avatar src={currentUser?.photoURL!} />} label={`${currentUser?.displayName} (Owner)`} />
                <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        inputRef={register(REPO_NAME_ERR)}
                        name="name"
                        autoFocus
                        defaultValue={repoDoc?.name}
                        margin="normal"
                        label="Repo name"
                        fullWidth
                    />
                    <Box color="error.main">{errors.name?.message}</Box>
                    <TextField
                        inputRef={register(REPO_DESC_ERR)}
                        name="description"
                        defaultValue={repoDoc?.description}
                        margin="normal"
                        label="Short description (optional)"
                        fullWidth
                    />
                    <Box color="error.main">{errors.description?.message}</Box>
                    <Controller
                        name="closeTimestamp"
                        control={control}
                        defaultValue={defaultCloseTs}
                        rules={{
                            validate: (selectedDate: Date) =>
                                selectedDate > now || `Must be after the present time: ${now.toLocaleString()}`
                        }}
                        render={({ ref, onChange, ...rest }) => (
                            <DateTimePicker
                                style={{ width: '100%' }}
                                margin="normal"
                                variant="dialog"
                                label="Close date and time"
                                helperText={
                                    errors.closeTimestamp ? (
                                        <Box component="span" color="error.main">
                                            {errors.closeTimestamp.message}
                                        </Box>
                                    ) : (
                                        `Students cannot upload or delete files after this date and time (but can still rename the uploaded ones until the final date and time below)`
                                    )
                                }
                                autoOk
                                disablePast={true}
                                hideTabs
                                minDate={now}
                                maxDate={utils?.addDays(now, 123)}
                                onChange={selected => {
                                    setcloseTimestamp(selected); // reset the finalTimestampMin to this value
                                    onChange(selected);
                                }}
                                allowKeyboardControl={false}
                                {...rest}
                            />
                        )}
                    />
                    <Controller
                        name="finalTimestamp"
                        defaultValue={defaultFinalTs}
                        control={control}
                        rules={{
                            validate: (selectedDate: Date) =>
                                // if the value of closeTimestamp is null, it nevers passes the check above: null > new Date() = false
                                selectedDate > closeTimestamp! || 'Must be after the close date and time above'
                        }}
                        render={({ ref, ...rest }) => (
                            <DateTimePicker
                                margin="normal"
                                variant="dialog"
                                label="Final date and time"
                                minDate={closeTimestamp}
                                maxDate={utils?.addDays(now, 130)}
                                helperText={
                                    <Box component="span" color="error.main">
                                        {errors.finalTimestamp?.message}
                                    </Box>
                                }
                                autoOk
                                disablePast={true}
                                hideTabs
                                allowKeyboardControl={false}
                                {...rest}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" style={{ margin: '8px 0' }}>
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
