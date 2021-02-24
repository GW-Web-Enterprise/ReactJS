import {
    Box,
    Tab,
    Tabs,
    Typography,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Paper,
    FormControl,
    InputLabel,
    NativeSelect,
    FormHelperText,
    Snackbar,
    Button
} from '@material-ui/core';
import React, { Fragment, useState, VFC } from 'react';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { SearchBar } from '@app/Components/SearchBar';
import { cloneComponent } from '@app/utils/cloneComponent';
import { PopoverItem } from '@app/Components/PopoverItem';

type TabPanelProps = { children?: React.ReactNode; index: number; value: number };

const TabPanel: VFC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    );
};

export const PushPopMember: VFC = () => {
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert onClose={() => setOpen(false)} severity="success">
                    Member removed (this notification should be closed before doing anything else)
                </Alert>
            </Snackbar>
            <Paper square>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs"
                >
                    <Tab label="Faculty members" />
                    <Tab label="System users" />
                </Tabs>
            </Paper>
            <TabPanel value={value} index={0}>
                <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                    <Typography color="primary" style={{ paddingLeft: '16px' }}>
                        Total: 10 members
                    </Typography>
                    <SearchBar placeholder="Search members..." />
                    {cloneComponent(10)(
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="Remy" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary="Steve Jobs" secondary="Student" />
                            <ListItemSecondaryAction>
                                <Tooltip title="Remove this member from the faculty" arrow>
                                    <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                                        <RemoveCircle />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                    <Typography color="primary" style={{ paddingLeft: '16px' }}>
                        Total: 20 users NOT in this faculty
                    </Typography>
                    <SearchBar placeholder="Search users..." />
                    {cloneComponent(20)(
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="Remy" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary="Steve Jobs" />
                            <ListItemSecondaryAction>
                                <PopoverItem
                                    placement="top"
                                    renderToggle={(toggle, toggleEl) => (
                                        <Tooltip title="Add this user to the faculty" arrow>
                                            <IconButton edge="end" aria-label="delete" onClick={toggle} ref={toggleEl}>
                                                <AddCircle />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    renderPopContent={() => (
                                        <FormControl>
                                            <InputLabel htmlFor="age-native-helper">Faculty role</InputLabel>
                                            <NativeSelect
                                                value="None"
                                                inputProps={{
                                                    name: 'role',
                                                    id: 'faculty-role-native-helper'
                                                }}
                                            >
                                                <option aria-label="None" value="" />
                                                <option value="student">student</option>
                                                <option value="coordinator">coordinator</option>
                                            </NativeSelect>
                                            <FormHelperText>What this member will be allowed to do?</FormHelperText>
                                            <Button variant="contained" color="primary">
                                                Add
                                            </Button>
                                        </FormControl>
                                    )}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List>
            </TabPanel>
        </Fragment>
    );
};
