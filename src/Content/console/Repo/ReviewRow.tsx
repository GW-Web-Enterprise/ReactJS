import { PopoverItem } from '@app/Components/PopoverItem';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
import { useFirestoreQuery } from '@app/hooks/useFirestoreQuery';
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Table,
    TableBody,
    ListItemText,
    ListItemIcon,
    Tooltip,
    Button
} from '@material-ui/core';
import { AssignmentTurnedIn, CancelSharp, GetApp, MoreVert } from '@material-ui/icons';
import firebase from 'firebase/app';
import { IDropboxDb, IDropboxReview } from '@app/typings/schemas';
import { Fragment, useState } from 'react';
import { ReviewSubmitDialog } from '@app/Content/console/Repo/ReviewSubmitDialog';
import { STATUS_TO_JSX } from '@app/constants/dropboxStatus';
import { displayFileSize } from '@app/utils/displayFileSize';
import { downloadFolderAsZip } from '@app/utils/downloadFolderAsZip';

const db = firebase.firestore();
export const ReviewRow: IRepoCollapsibleRow = ({ open, repoId }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dropbox, setDropbox] = useState<IDropboxReview>(null);
    const { data = [], status } = useFirestoreQuery(db.collection('repos').doc(repoId).collection('dropboxes'));
    return (
        <Fragment>
            <ReviewSubmitDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                repoId={repoId}
                dropbox={dropbox}
            />
            <TableRow>
                {status === 'success' && (
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Review dropboxes of students in the faculty
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <strong>Owner's name</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>Owner's email</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>Created at</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>Size</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>Status</strong> (hover to see more)
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map(
                                            ({
                                                id,
                                                facultyId,
                                                repoId,
                                                ownerId,
                                                ownerName,
                                                ownerEmail,
                                                createdAt,
                                                status,
                                                size,
                                                reviewerName,
                                                reviewerEmail,
                                                reviewedAt,
                                                feedback
                                            }: IDropboxDb) =>
                                                (size && (
                                                    <TableRow key={id}>
                                                        <TableCell component="th" scope="row">
                                                            {ownerName}
                                                        </TableCell>
                                                        <TableCell align="right">{ownerEmail}</TableCell>
                                                        <TableCell align="right">
                                                            {createdAt.toDate().toLocaleString()}
                                                        </TableCell>
                                                        <TableCell align="right">{displayFileSize(size)}</TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip
                                                                title={
                                                                    <Fragment>
                                                                        <div>Reviewer's name: {reviewerName}</div>
                                                                        <div>Reviewer's email: {reviewerEmail}</div>
                                                                        <div>
                                                                            At: {reviewedAt?.toDate().toLocaleString()}
                                                                        </div>
                                                                        <div>Feedback: {feedback}</div>
                                                                    </Fragment>
                                                                }
                                                                arrow
                                                            >
                                                                <Button>{STATUS_TO_JSX[status]}</Button>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
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
                                                                    <List component="nav" dense>
                                                                        <ListItem
                                                                            button
                                                                            onClick={() => {
                                                                                downloadFolderAsZip(
                                                                                    `faculty_${facultyId}/repo_${repoId}/dropbox_${ownerId}`,
                                                                                    `${ownerName}_${ownerEmail}_${ownerId}.zip`
                                                                                );
                                                                                close();
                                                                            }}
                                                                        >
                                                                            <ListItemIcon>
                                                                                <GetApp />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary="Download to view" />
                                                                        </ListItem>
                                                                        <ListItem
                                                                            button
                                                                            onClick={() => {
                                                                                close();
                                                                                setDropbox({
                                                                                    id,
                                                                                    status: 'approved'
                                                                                });
                                                                                setDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <ListItemIcon>
                                                                                <AssignmentTurnedIn />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary="Approve" />
                                                                        </ListItem>
                                                                        <ListItem
                                                                            button
                                                                            onClick={() => {
                                                                                close();
                                                                                setDropbox({
                                                                                    id,
                                                                                    status: 'rejected'
                                                                                });
                                                                                setDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <ListItemIcon>
                                                                                <CancelSharp />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary="Reject" />
                                                                        </ListItem>
                                                                    </List>
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )) || <Fragment key={id} />
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                )}
            </TableRow>
        </Fragment>
    );
};