import { PopoverItem } from '@app/Components/PopoverItem';
import { DeleteRepo } from '@app/Content/console/Repo/DeleteRepo';
import { EditRepo } from '@app/Content/console/Repo/EditRepo';
import { RepoDbRead } from '@app/typings/schemas';
import { IconButton, Link, List, ListItem, TableCell, TableRow, Tooltip } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, MoreVert } from '@material-ui/icons';
import { VFC } from 'react';

type Props = {
    repoDoc: RepoDbRead;
    /** The open state of the collapsible table below this table's row */
    collapseOpen: boolean;
    /** Toggle the collapsible table below this table's row  */
    toggleCollapse: () => void;
};
export const RepoTableRow: VFC<Props> = ({ repoDoc, collapseOpen, toggleCollapse }) => {
    const { id, name, description, closeTimestamp, finalTimestamp } = repoDoc;
    return (
        <TableRow>
            <TableCell>
                <IconButton aria-label="Toggle list of articles" size="small" onClick={toggleCollapse}>
                    {collapseOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                <Tooltip title={description ?? ''} placement="bottom">
                    <Link component="button" variant="body2">
                        {name}
                    </Link>
                </Tooltip>
            </TableCell>
            <TableCell align="right">{closeTimestamp.toDate().toLocaleString()}</TableCell>
            <TableCell align="right">{finalTimestamp.toDate().toLocaleString()}</TableCell>
            <TableCell>
                <PopoverItem
                    placement="bottomRight"
                    padding={0}
                    renderToggle={(toggle, toggleEl) => (
                        <IconButton aria-label="View more options" size="small" onClick={toggle} ref={toggleEl}>
                            <MoreVert />
                        </IconButton>
                    )}
                    renderPopContent={close => (
                        <List component="nav" dense>
                            <ListItem button>
                                <EditRepo repoDoc={repoDoc} cleanup={close} />
                            </ListItem>
                            <ListItem button>
                                <DeleteRepo repoId={id} name={name} cleanup={close} />
                            </ListItem>
                        </List>
                    )}
                />
            </TableCell>
        </TableRow>
    );
};
