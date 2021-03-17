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
    Typography
} from '@material-ui/core';
import { RemoveCircle } from '@material-ui/icons';
import { VFC } from 'react';

export const MembersTabPanel: VFC<{ value: number }> = ({ value }) => {
    return (
        // Member removed (this notification should be closed before doing anything else)
        <TabPanel value={value} index={0}>
            <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                <Typography color="primary" style={{ paddingLeft: '16px' }}>
                    Total: 10 members
                </Typography>
                {cloneComponent(5)(
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="Remy" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText primary="Steve Jobs" secondary="Student" />
                        <ListItemSecondaryAction>
                            <Tooltip title="Remove this member from the faculty" arrow>
                                <IconButton edge="end" aria-label="delete">
                                    <RemoveCircle />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
        </TabPanel>
    );
};
