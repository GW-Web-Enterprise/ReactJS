import { PopoverItem } from '@app/Components/PopoverItem';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';
import {
    Avatar,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Tooltip
} from '@material-ui/core';
import { Check, MoreVert, StarBorder, Stars } from '@material-ui/icons';
import firebase from 'firebase/app';
import { Fragment, useEffect, useState } from 'react';

const functions = firebase.app().functions('asia-southeast2');
const getUsers = functions.httpsCallable('default-getUsers');
const setRole = functions.httpsCallable('default-setRole');
type Payload = { isGuest?: boolean; isManager?: boolean };
type Sysuser = {
    uid: string;
    photoURL: string;
    email: string;
    displayName: string;
    customClaims: Payload & {
        isAdmin?: boolean;
    };
};
export const UserList = () => {
    const { showAlert } = useGlobalUtils();
    const [data, setData] = useState<Array<Sysuser>>([]);
    useEffect(() => {
        getUsers({}).then(({ data: { users } }) => setData(users));
    }, []);
    const handleSetRole = (index: number, payload: Payload & { uid: string }) =>
        setRole(payload).then(() => {
            showAlert({ status: 'success', message: 'Role is set successfully' });
            const temp = data.slice();
            temp[index] = { ...temp[index], customClaims: { ...payload } };
            setData(temp);
        });
    return (
        <Fragment>
            {!data.length && <LinearProgress />}
            <List style={{ position: 'relative', overflow: 'auto', maxHeight: 300, maxWidth: 400 }}>
                {data.map(
                    ({ uid, email, displayName, photoURL, customClaims: { isManager, isAdmin } }, index) =>
                        !isAdmin && (
                            <ListItem key={uid}>
                                <ListItemIcon>
                                    <Tooltip title={isManager ? 'Manager' : 'Guest'} arrow>
                                        {isManager ? <Stars /> : <StarBorder />}
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemAvatar>
                                    <Avatar alt={displayName} src={photoURL} />
                                </ListItemAvatar>
                                <ListItemText primary={displayName} secondary={email} />
                                <ListItemSecondaryAction>
                                    <PopoverItem
                                        placement="bottomRight"
                                        padding={0}
                                        renderToggle={(toggle, toggleEl) => (
                                            <IconButton
                                                aria-label="View more options"
                                                size="small"
                                                onClick={toggle}
                                                ref={toggleEl}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        )}
                                        renderPopContent={close => (
                                            <List
                                                component="nav"
                                                dense
                                                style={{
                                                    maxWidth: 300
                                                }}
                                            >
                                                <ListItem
                                                    button
                                                    disabled={!!isManager}
                                                    onClick={() => {
                                                        close();
                                                        handleSetRole(index, { uid, isManager: true });
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Manager"
                                                        secondary="Can access any faculty and download files uploaded from any student in the faculty"
                                                    />
                                                    {isManager && (
                                                        <ListItemIcon>
                                                            <Check />
                                                        </ListItemIcon>
                                                    )}
                                                </ListItem>
                                                <ListItem
                                                    button
                                                    disabled={!isManager}
                                                    onClick={() => {
                                                        close();
                                                        handleSetRole(index, { uid, isGuest: true });
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Guest"
                                                        secondary="Can view reports at the overview page. Upload or review files in the faculty based on role"
                                                    />
                                                    {!isManager && (
                                                        <ListItemIcon>
                                                            <Check />
                                                        </ListItemIcon>
                                                    )}
                                                </ListItem>
                                            </List>
                                        )}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                )}
            </List>
        </Fragment>
    );
};
