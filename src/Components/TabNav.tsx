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
    Paper
} from '@material-ui/core';
import React, { Fragment, useState, VFC } from 'react';
import { SearchBar } from './SearchBar';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { cloneComponent } from '../utils';

type TabPanelProps = { children?: React.ReactNode; index: number; value: number };

const TabPanel: VFC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    );
};

export const TabNav: VFC = () => {
    const [value, setValue] = useState(0);
    const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);
    return (
        <Fragment>
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
                                <Tooltip title="Remove this member from the faculty">
                                    <IconButton edge="end" aria-label="delete">
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
                        Total: 20 users
                    </Typography>
                    <SearchBar placeholder="Search users..." />
                    {cloneComponent(20)(
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt="Remy" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText primary="Steve Jobs" />
                            <ListItemSecondaryAction>
                                <Tooltip title="Add this user to the faculty">
                                    <IconButton edge="end" aria-label="delete">
                                        <AddCircle />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List>
            </TabPanel>
        </Fragment>
    );
};
