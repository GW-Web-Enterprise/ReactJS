import { PopoverItem } from '@app/Components/PopoverItem';
import { TabPanel } from '@app/Components/TabPanel';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip,
    FormControl,
    InputLabel,
    NativeSelect,
    FormHelperText,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { useRef, VFC } from 'react';
import firebase from 'firebase/app';
import { ISysuserDb } from '@app/typings/schemas';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

const facultiesRef = firebase.firestore().collection('faculties');
type IProps = { value: number; facultyId: string };
export const SysusersTabPanel: VFC<IProps> = ({ value, facultyId }) => {
    const { data = [], status } = useFirestoreQuery(facultiesRef.doc(facultyId).collection('sysusers'));
    const { showAlert } = useGlobalUtils();
    const roleSelector = useRef<HTMLSelectElement | null>(null);
    return (
        <TabPanel value={value} index={1}>
            {status === 'success' && (
                <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300 }}>
                    <Typography color="primary" style={{ paddingLeft: '16px' }}>
                        Users not in this faculty:
                    </Typography>
                    <Typography color="inherit" variant="caption" style={{ paddingLeft: '16px' }} gutterBottom>
                        it might take some time to add new user to this list
                    </Typography>
                    {!data.length && (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress /> &nbsp; Loading users, please wait...
                        </Box>
                    )}
                    {data.map(({ id, displayName, email, photoURL }: ISysuserDb) => (
                        <ListItem key={id}>
                            <ListItemAvatar>
                                <Avatar alt={displayName} src={photoURL} />
                            </ListItemAvatar>
                            <ListItemText primary={displayName} secondary={email} />
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
                                    renderPopContent={close => (
                                        <FormControl>
                                            <InputLabel>Faculty role</InputLabel>
                                            <NativeSelect
                                                inputRef={roleSelector}
                                                inputProps={{
                                                    name: 'role'
                                                }}
                                            >
                                                <option value="" />
                                                <option value="student">student</option>
                                                <option value="coordinator">coordinator</option>
                                            </NativeSelect>
                                            <FormHelperText>What this member will be allowed to do?</FormHelperText>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    roleSelector.current?.value &&
                                                    facultiesRef
                                                        .doc(facultyId)
                                                        .collection('members')
                                                        .doc(id)
                                                        .set(
                                                            {
                                                                displayName,
                                                                email,
                                                                photoURL,
                                                                role: roleSelector.current!.value
                                                            },
                                                            { merge: true }
                                                        )
                                                        .then(() =>
                                                            showAlert({
                                                                status: 'success',
                                                                message: `User ${displayName} has become a member of this faculty`
                                                            })
                                                        )
                                                        .catch(() =>
                                                            showAlert({
                                                                status: 'error',
                                                                message: 'Failed to add memmber to this faculty'
                                                            })
                                                        )
                                                        .then(close)
                                                }
                                            >
                                                Add
                                            </Button>
                                        </FormControl>
                                    )}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </TabPanel>
    );
};
