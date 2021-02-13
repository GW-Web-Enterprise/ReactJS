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
import React, { Fragment, useState, VFC } from 'react';
import { PopoverItem, TabNav } from '../../Components';
import { cloneComponent } from '../../utils';

export const Faculty: VFC = () => {
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

            {cloneComponent(10)(
                <PopoverItem
                    placement="bottom"
                    renderToggle={(toggle, toggleEl) => (
                        <Button
                            variant="outlined"
                            color="primary"
                            ref={toggleEl}
                            onClick={toggle}
                            style={{
                                color: '#1976d2',
                                border: '1px solid rgba(25, 118, 210, 0.5)'
                            }}
                        >
                            Faculty of Math
                        </Button>
                    )}
                    renderPopContent={() => <TabNav />}
                />
            )}
        </Fragment>
    );
};
