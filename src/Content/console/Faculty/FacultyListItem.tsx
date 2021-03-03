import { PopoverItem } from '@app/Components/PopoverItem';
import { VFC } from 'react';
import firebase from 'firebase/app';
import {
    Box,
    ButtonGroup,
    Button,
    TextField,
    Tooltip,
    Typography,
    FormControl,
    makeStyles,
    createStyles
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { PushPopMember } from '@app/Content/console/Faculty/PushPopMember';
import { FacultyRead, FacultySave } from '@app/typings/schemas';
import { useForm } from 'react-hook-form';
import { FACULTY_NAME_ERR } from '@app/constants/inputErrs';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

const useStyles = makeStyles(() =>
    createStyles({
        actionBtn: {
            color: '#1976d2',
            border: '1px solid rgba(25, 118, 210, 0.5)'
        }
    })
);

type Props = {
    facultyDoc: FacultyRead;
};

export const FacultyListItem: VFC<Props> = ({ facultyDoc }) => {
    const { showAlert } = useGlobalUtils();
    const { register, handleSubmit, errors } = useForm<FacultySave>();
    const classes = useStyles();
    const docRef = firebase.firestore().collection('faculties').doc(facultyDoc.id);
    const handleEdit = (toggleEditForm: () => void) => ({ name, ...rest }: FacultySave) =>
        docRef
            .update({ name: name.toLowerCase(), ...rest })
            .then(() => showAlert({ status: 'success', message: 'Faculty name is changed successfully' }))
            .catch(err => {
                console.log(err);
                showAlert({ status: 'error', message: 'Faculty name already exists, please choose another name' });
            })
            .then(() => toggleEditForm());
    return (
        <ButtonGroup color="inherit" style={{ margin: '8px' }}>
            {/* ⤵ View and add/remove faculty members */}
            <PopoverItem
                placement="bottom"
                renderToggle={(toggle, toggleEl) => (
                    <Tooltip title="Click to view faculty members" arrow>
                        <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                            {facultyDoc.name}
                        </Button>
                    </Tooltip>
                )}
                renderPopContent={() => <PushPopMember />}
            />
            {/* ⤵ Edit faculty name */}
            <PopoverItem
                placement="bottom"
                renderToggle={(toggle, toggleEl) => (
                    <Tooltip title="Edit faculty name" arrow>
                        <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                            <Edit />
                        </Button>
                    </Tooltip>
                )}
                renderPopContent={toggle => (
                    <FormControl>
                        <TextField
                            inputRef={register(FACULTY_NAME_ERR)}
                            name="name"
                            variant="outlined"
                            margin="normal"
                            label="New faculty name"
                        />
                        <Box color="error.main">{errors.name?.message}</Box>
                        <Button variant="contained" color="primary" onClick={handleSubmit(handleEdit(toggle))}>
                            Edit
                        </Button>
                    </FormControl>
                )}
            />
            {/* ⤵ Delete faculty */}
            <PopoverItem
                placement="bottom"
                renderToggle={(toggle, toggleEl) => (
                    <Tooltip title="Delete faculty" arrow>
                        <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                            <Delete />
                        </Button>
                    </Tooltip>
                )}
                renderPopContent={toggle => (
                    <Box>
                        <Typography variant="button" display="block" gutterBottom>
                            Delete this faculty?
                        </Typography>
                        <Button variant="contained" onClick={toggle} color="secondary">
                            No
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ float: 'right' }}
                            onClick={() =>
                                docRef
                                    .delete()
                                    .then(() =>
                                        showAlert({ status: 'success', message: 'Faculty deleted successfully' })
                                    )
                                    .catch(err => {
                                        console.log(err);
                                        showAlert({ status: 'error', message: 'Failed to delete faculty' });
                                    })
                            }
                        >
                            Yes
                        </Button>
                    </Box>
                )}
            />
        </ButtonGroup>
    );
};
