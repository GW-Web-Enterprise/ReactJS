import { useAuth } from '@app/hooks/useAuth';
import { IDropboxReview } from '@app/typings/schemas';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { VFC } from 'react';

type Props = { open: boolean; onClose: () => void; dropbox: IDropboxReview };
const dropboxStatusNow = {
    approved: 'approve',
    rejected: 'reject',
    none: ''
};
export const ReviewSubmitDialog: VFC<Props> = ({ open, onClose, dropbox }) => {
    const { currentUser } = useAuth();
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle id="form-dialog-title">Feedback on the entire coursework</DialogTitle>
            <DialogContent>
                <Chip
                    avatar={<Avatar src={currentUser!.photoURL!} />}
                    label={`${currentUser!.displayName} (Coordinator)`}
                />
                <TextField
                    id="standard-textarea"
                    margin="normal"
                    placeholder="Please explain why you come to this decision"
                    helperText="Text can span multiple lines, you can hit the enter key to find out"
                    multiline
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancle</Button>
                <Button variant="contained" color="primary">
                    {dropboxStatusNow[dropbox?.status || 'none']}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
