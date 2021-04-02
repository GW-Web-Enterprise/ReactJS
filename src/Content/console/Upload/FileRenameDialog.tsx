import { REGEX_FILENAME } from '@app/constants/regexes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { useCallback, useState, VFC } from 'react';

type IFileRenameDialogProps = {
    open: boolean;
    onClose: () => void;
    onOkay: (newName: string) => Promise<void>;
    filename: string;
};
export const FileRenameDialog: VFC<IFileRenameDialogProps> = ({ open, onClose, filename, onOkay }) => {
    const [node, setNode] = useState<HTMLInputElement | null>(null);
    // This callback ref never gets re-initialized on re-render
    const onRefChange = useCallback(
        // Invoked with HTML DOM input element when the dialog is mounted
        // and invoked with null when dialog is unmounted
        (textInput: HTMLInputElement | null) => {
            setNode(textInput); // lift the text input up so that the onClick handler of the 'Ok' btn can access it
            textInput && textInput.setSelectionRange(0, filename.lastIndexOf('.'));
        },
        [filename]
    );
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle id="form-dialog-title">Rename</DialogTitle>
            <DialogContent>
                <TextField
                    name="name"
                    margin="dense"
                    autoFocus
                    fullWidth
                    inputRef={onRefChange}
                    helperText="If you cannot rename, please make sure the entered filename is in the right format 'filename.ext'"
                    defaultValue={filename}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancle</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => REGEX_FILENAME.test(node!.value) && onOkay(node!.value) && onClose()}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
