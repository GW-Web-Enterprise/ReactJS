import { useAuth } from '@app/hooks/useAuth';
import { IDropboxReview } from '@app/typings/schemas';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { useRef, VFC } from 'react';
import firebase from 'firebase/app';
import { useGlobalUtils } from '@app/hooks/useGlobalUtils';

const dropboxStatusNow = {
    approved: 'approve',
    rejected: 'reject',
    none: ''
};
const db = firebase.firestore();
type Props = { open: boolean; repoId: string; dropbox: IDropboxReview; onClose: () => void };
export const ReviewSubmitDialog: VFC<Props> = ({ open, repoId, dropbox, onClose }) => {
    const { showAlert } = useGlobalUtils();
    const { currentUser } = useAuth();
    const textInput = useRef<HTMLInputElement>(null);
    const handleSubmit = () =>
        db
            .collection('repos')
            .doc(repoId)
            .collection('dropboxes')
            .doc(dropbox?.id)
            .update({
                reviewerId: currentUser!.uid,
                reviewerName: currentUser!.displayName,
                reviewerEmail: currentUser!.email,
                feedback: textInput.current!.value,
                status: dropbox?.status,
                reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => showAlert({ status: 'success', message: 'Review is submitted successfully' }))
            .catch(() =>
                showAlert({
                    status: 'error',
                    message: 'Operation is not allowed because you are not a coordinator of this faculty'
                })
            )
            .then(onClose);
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle id="form-dialog-title">Feedback on the entire coursework</DialogTitle>
            <DialogContent>
                <Chip avatar={<Avatar src={currentUser!.photoURL!} />} label={`${currentUser!.displayName}`} />
                <TextField
                    id="standard-textarea"
                    inputRef={textInput}
                    inputProps={{ maxLength: 500 }}
                    defaultValue={dropbox?.feedback || ''}
                    margin="normal"
                    placeholder="Please explain why you come to this decision"
                    helperText="Text can span multiple lines, you can hit the enter key to find out"
                    multiline
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancle</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {dropboxStatusNow[dropbox?.status || 'none']}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
