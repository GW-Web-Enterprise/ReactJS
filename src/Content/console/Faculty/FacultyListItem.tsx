import { PopoverItem } from '@app/Components/PopoverItem';
import React, { VFC } from 'react';
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

const useStyles = makeStyles(() =>
    createStyles({
        actionBtn: {
            color: '#1976d2',
            border: '1px solid rgba(25, 118, 210, 0.5)'
        }
    })
);

export const FacultyListItem: VFC = () => {
    const classes = useStyles();
    return (
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
                renderPopContent={() => <PushPopMember />}
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
    );
};
