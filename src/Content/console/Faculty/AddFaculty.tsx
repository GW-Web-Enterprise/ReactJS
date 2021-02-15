import React, { Fragment, useState, VFC } from 'react';
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

export const AddFaculty: VFC = () => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <Tooltip title="Add new faculty" arrow>
                <Box position="fixed" bottom={16} right={16} onClick={() => setOpen(true)}>
                    <Fab color="primary" style={{ background: '#1976d2' }}>
                        <Add />
                    </Fab>
                </Box>
            </Tooltip>
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new faculty</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="faculty" label="Faculty name" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
