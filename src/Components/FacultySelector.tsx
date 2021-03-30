import { useAuth } from '@app/hooks/useAuth';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { Box, LinearProgress, List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Dispatch, Fragment, SetStateAction, useRef, useState, VFC } from 'react';

type Props = { onSelect: Dispatch<SetStateAction<string>>; query: firebase.default.firestore.Query; viewAll?: boolean };
export const FacultySelector: VFC<Props> = ({ onSelect, query, viewAll }) => {
    const facultySelector = useRef(null);
    const { userRole } = useAuth();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleFacSelect = (index: number, facultyId: string) => () => {
        onSelect(facultyId);
        setMenuOpen(false);
        setSelectedIndex(index);
    };
    const { data: options = [], status } = useFirestoreQuery(query);
    return (
        <Fragment>
            {status === 'loading' && <LinearProgress />}
            {status === 'success' && (
                <Fragment>
                    <List component="nav" style={{ display: 'inline-block' }}>
                        <ListItem button onClick={() => setMenuOpen(true)} innerRef={facultySelector}>
                            <ListItemText
                                primary="Select a faculty to view its repos"
                                secondary={`Chosen faculty: ${
                                    options[selectedIndex]?.facultyName || options[selectedIndex]?.name || 'none'
                                }`}
                            />
                        </ListItem>
                    </List>
                    <Menu
                        anchorEl={facultySelector.current}
                        open={menuOpen}
                        onClose={() => setMenuOpen(false)}
                        PaperProps={{ style: { maxHeight: 48 * 4.5 } }}
                        variant="menu"
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }}
                    >
                        {options.map(
                            (
                                { id, ...doc }: { id: string; name?: string; facultyId?: string; facultyName?: string },
                                index
                            ) => (
                                <MenuItem
                                    key={id}
                                    selected={index === selectedIndex}
                                    onClick={handleFacSelect(index, doc.facultyId || id)}
                                >
                                    {doc.name || doc.facultyName}
                                </MenuItem>
                            )
                        )}
                        {!options.length && (
                            <Box color="info.main" p={1}>
                                {window.location.pathname === '/console/upload'
                                    ? 'We cannot find any faculty that you are a student of'
                                    : userRole === 'admin' || userRole === 'manager'
                                    ? 'No faculty is created yet'
                                    : 'We cannot find any faculty that you are a coordinator of'}
                            </Box>
                        )}
                    </Menu>
                </Fragment>
            )}
        </Fragment>
    );
};
