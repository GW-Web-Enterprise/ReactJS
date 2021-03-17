import { TabPanel } from '@app/Components/TabPanel';
import {
    Avatar,
    IconButton,
    Link,
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
import firebase from 'firebase/app';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { IFacultyMemberDb } from '@app/typings/schemas';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

type IProps = { value: number; facultyId: string };
export const MembersTabPanel: VFC<IProps> = ({ value, facultyId }) => {
    const membersRef = firebase.firestore().collection('faculties').doc(facultyId).collection('members');
    const { data = [], status } = useFirestoreQuery(membersRef);
    const { showAlert } = useGlobalUtils();
    return (
        <TabPanel value={value} index={0}>
            {status === 'success' && (
                <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                    <Typography color="primary" style={{ paddingLeft: '16px' }}>
                        Members in this faculty:
                    </Typography>
                    {data.map(({ id, displayName, email, photoURL, role }: IFacultyMemberDb) => (
                        <ListItem key={id}>
                            <ListItemAvatar>
                                <Avatar alt={displayName} src={photoURL} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Tooltip title={email} placement="bottom" arrow>
                                        <Link component="button">{displayName}</Link>
                                    </Tooltip>
                                }
                                secondary={role}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Remove this member from the faculty" arrow>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            membersRef
                                                .doc(id)
                                                .delete()
                                                .then(() =>
                                                    showAlert({
                                                        status: 'success',
                                                        message: `Member ${displayName} has been removed from this faculty`
                                                    })
                                                )
                                                .catch(() =>
                                                    showAlert({
                                                        status: 'error',
                                                        message: 'Failed to remove memmber from this faculty'
                                                    })
                                                )
                                        }
                                    >
                                        <RemoveCircle />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </TabPanel>
    );
};
