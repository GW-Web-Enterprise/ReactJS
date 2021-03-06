import { FACULTY_NAME_ERR } from '@app/constants/inputErrs';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import { FacultyDbSave } from '@app/typings/schemas';
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
import firebase from 'firebase/app';
import { Fragment, useState, VFC } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
    numbFaculties: number;
};
const facultiesRef = firebase.firestore().collection('faculties');
export const AddFaculty: VFC<Props> = ({ numbFaculties }) => {
    const { showAlert } = useGlobalUtils();
    const [dialogOpen, setDialogOpen] = useState(false);
    const { register, handleSubmit, errors } = useForm<FacultyDbSave>();
    const handleCreate = ({ name, ...rest }: FacultyDbSave) =>
        facultiesRef
            .add({ name: name.toLowerCase(), ...rest })
            .then(() => showAlert({ status: 'success', message: 'Faculty added successfully' }))
            .catch(err => {
                // Could be due to unique faculty name constraint or the number of faculties reach its maximum number
                console.log(err);
                showAlert({
                    status: 'error',
                    message:
                        numbFaculties === 20
                            ? 'Maximum number of faculties is 20, you cannot add more. Sorry!'
                            : 'Faculty name already exists, please choose another name'
                });
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
