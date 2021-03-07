import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import { FacultyDbRead } from '@app/typings/schemas';
import { LinearProgress, List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { Dispatch, Fragment, SetStateAction, useRef, useState, VFC } from 'react';

type Props = { onSelect: Dispatch<SetStateAction<string>> };
const db = firebase.firestore();
export const FacultySelector: VFC<Props> = ({ onSelect }) => {
    const facultySelector = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleFacSelect = (index: number, facultyId: string) => () => {
        onSelect(facultyId);
        setMenuOpen(false);
        setSelectedIndex(index);
    };
    const { data: options = [], status } = useFirestoreQuery(db.collection('faculties'));
    return (
        <Fragment>
            {status === 'loading' && <LinearProgress />}
            {status === 'success' && (
                <Fragment>
                    <List component="nav" style={{ display: 'inline-block' }}>
                        <ListItem button onClick={() => setMenuOpen(true)} innerRef={facultySelector}>
                            <ListItemText
                                primary="Select a faculty to view its repos"
                                secondary={`Chosen faculty: ${options[selectedIndex]?.name || 'none'}`}
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
                        {options.map(({ id, name }: FacultyDbRead, index) => (
                            <MenuItem key={id} selected={index === selectedIndex} onClick={handleFacSelect(index, id)}>
                                {name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Fragment>
            )}
        </Fragment>
    );
};
