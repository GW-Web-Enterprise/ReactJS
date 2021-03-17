import { PopoverItem } from '@app/Components/PopoverItem';
import { TabPanel } from '@app/Components/TabPanel';
import { cloneComponent } from '@app/utils/cloneComponent';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    Typography,
    FormControl,
    InputLabel,
    NativeSelect,
    FormHelperText,
    Button
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { VFC } from 'react';

export const SysusersTabPanel: VFC<{ value: number }> = ({ value }) => {
    return (
        <TabPanel value={value} index={1}>
            <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                <Typography color="primary" style={{ paddingLeft: '16px' }}>
                    Total: 20 users NOT in this faculty
                </Typography>
                {cloneComponent(5)(
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
    );
};
