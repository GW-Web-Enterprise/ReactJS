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
export const ReviewRow: IRepoCollapsibleRow = ({ open, repoDoc }) => {
    const { id: repoId } = repoDoc;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dropbox, setDropbox] = useState<IDropboxReview>(null);
    const { data = [], status } = useFirestoreQuery(
        db.collection('repos').doc(repoId).collection('dropboxes').where('size', '!=', 0)
    );
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
                                                <strong>Status</strong> (click to see more)
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
                                            }: IDropboxDb) => (
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
                                                        <PopoverItem
                                                            placement="bottom"
                                                            renderToggle={(toggle, toggleEl) => (
                                                                <Button type="button" ref={toggleEl} onClick={toggle}>
                                                                    {STATUS_TO_JSX[status]}
                                                                </Button>
                                                            )}
                                                            renderPopContent={() =>
                                                                (status !== 'pending' && (
                                                                    <Fragment>
                                                                        <div>
                                                                            <strong>Reviewer's name:</strong>{' '}
                                                                            {reviewerName}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Reviewer's email:</strong>{' '}
                                                                            {reviewerEmail}
                                                                        </div>
                                                                        <div>
                                                                            <strong>At:</strong>{' '}
                                                                            {reviewedAt?.toDate().toLocaleString()}
                                                                        </div>
                                                                        <div style={{ whiteSpace: 'pre-line' }}>
                                                                            <strong>Feedback:</strong> {feedback}
                                                                        </div>
                                                                    </Fragment>
                                                                )) ||
                                                                'No one has reviewed this dropbox'
                                                            }
                                                        />
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
                                                                                status: 'approved',
                                                                                feedback
                                                                            });
                                                                            setDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <AssignmentTurnedIn />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary="Approve or edit feedback" />
                                                                    </ListItem>
                                                                    <ListItem
                                                                        button
                                                                        onClick={() => {
                                                                            close();
                                                                            setDropbox({
                                                                                id,
                                                                                status: 'rejected',
                                                                                feedback
                                                                            });
                                                                            setDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <CancelSharp />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary="Reject or edit feedback" />
                                                                    </ListItem>
                                                                </List>
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
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
