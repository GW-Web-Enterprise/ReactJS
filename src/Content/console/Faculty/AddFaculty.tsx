import React, { Fragment, useState, VFC, Dispatch, SetStateAction } from 'react';
import firebase from 'firebase/app';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField,
    Tooltip
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { FACULTY_NAME_ERR } from '@app/constants/inputErrs';
import { FacultySave } from '@app/typings/schemas';
import { AlertInfo } from '@app/typings/components';

type Props = {
    setAlertInfo: Dispatch<SetStateAction<AlertInfo>>;
    onCreate: (data: FacultySave) => Promise<firebase.firestore.DocumentReference>;
};
export const AddFaculty: VFC<Props> = ({ onCreate, setAlertInfo }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { register, handleSubmit, errors } = useForm<FacultySave>();
    const handleCreate = (data: FacultySave) =>
        onCreate(data)
            .then(() => setAlertInfo({ status: 'success', message: 'Faculty added successfully' }))
            .catch(err => {
                console.log(err);
                setAlertInfo({ status: 'error', message: 'Failed to add faculty' });
            })
            .then(() => setDialogOpen(false));

    return (
        <Fragment>
            <Tooltip title="Add new faculty" arrow>
                <Box position="fixed" bottom={16} right={16} onClick={() => setDialogOpen(true)}>
                    <Fab color="primary" style={{ background: '#1976d2' }}>
                        <Add />
                    </Fab>
                </Box>
            </Tooltip>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new faculty</DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={register(FACULTY_NAME_ERR)}
                        name="name"
                        autoFocus
                        margin="dense"
                        id="faculty"
                        label="Faculty name"
                        fullWidth
                    />
                    <Box color="error.main">{errors.name?.message}</Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(handleCreate)} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
