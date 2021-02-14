import { PopoverItem } from '@app/Components/PopoverItem';
import { TabNav } from '@app/Content/console/Faculty/TabNav';
import { cloneComponent } from '@app/utils/cloneComponent';
import {
    Box,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Button,
    TextField,
    Tooltip,
    Typography,
    makeStyles,
    createStyles,
    FormControl
} from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import React, { Fragment, useState, VFC } from 'react';

const useStyles = makeStyles(() =>
    createStyles({
        actionBtn: {
            color: '#1976d2',
            border: '1px solid rgba(25, 118, 210, 0.5)'
        }
    })
);

export const Faculty: VFC = () => {
    const classes = useStyles();
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
                <ButtonGroup color="inherit" style={{ margin: '8px' }}>
                    <PopoverItem
                        placement="bottom"
                        renderToggle={(toggle, toggleEl) => (
                            <Tooltip title="Click to view faculty members" arrow>
                                <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                                    Math
                                </Button>
                            </Tooltip>
                        )}
                        renderPopContent={() => <TabNav />}
                    />
                    <PopoverItem
                        placement="bottom"
                        renderToggle={(toggle, toggleEl) => (
                            <Tooltip title="Edit faculty name" arrow>
                                <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                                    <Edit />
                                </Button>
                            </Tooltip>
                        )}
                        renderPopContent={() => (
                            <FormControl>
                                <TextField variant="outlined" margin="normal" label="New faculty name" />
                                <Button variant="contained" color="primary">
                                    Edit
                                </Button>
                            </FormControl>
                        )}
                    />
                    <PopoverItem
                        placement="bottom"
                        renderToggle={(toggle, toggleEl) => (
                            <Tooltip title="Delete faculty" arrow>
                                <Button ref={toggleEl} onClick={toggle} className={classes.actionBtn}>
                                    <Delete />
                                </Button>
                            </Tooltip>
                        )}
                        renderPopContent={() => (
                            <Box>
                                <Typography variant="button" display="block" gutterBottom>
                                    Delete this faculty?
                                </Typography>
                                <Button variant="contained" color="secondary">
                                    No
                                </Button>
                                <Button variant="contained" color="primary" style={{ float: 'right' }}>
                                    Yes
                                </Button>
                            </Box>
                        )}
                    />
                </ButtonGroup>
            )}
        </Fragment>
    );
};
