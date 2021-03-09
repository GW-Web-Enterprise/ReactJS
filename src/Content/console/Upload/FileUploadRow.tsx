import { getSizeOfFiles } from '@app/utils/getSizeOfFiles';
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { useRef } from 'react';
import { IRepoCollapsibleRow } from '@app/Components/RepoTable';
import { FileListRows } from '@app/Content/console/Upload/FileListRows';
import { LimitedBackdrop } from '@app/Components/LimitedBackdrop';
import { useFileUpload } from '@app/hooks/useFileUpload';

export const FileUploadRow: IRepoCollapsibleRow = ({ open, facultyId, repoId }) => {
    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles, setRawFileList, filenameMemo, wait] = useFileUpload(fileInput, facultyId, repoId);
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, position: 'relative' }} colSpan={6}>
                {wait && (
                    <LimitedBackdrop open={true}>
                        <CircularProgress /> &nbsp; Uploading files, please wait...
                    </LimitedBackdrop>
                )}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom>
                            Your dropbox
                            <Box color="info.main" display="inline" fontSize="fontSize" ml={1}>
                                <strong>Status:</strong> pending
                            </Box>
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CloudUpload />}
                            onClick={() => fileInput.current?.click()}
                        >
                            Upload file
                        </Button>
                        <Typography variant="subtitle2" gutterBottom component="span" style={{ marginLeft: 8 }}>
                            Total size of uploaded files: {getSizeOfFiles(files)[0]}
                        </Typography>
                        <input
                            type="file"
                            multiple
                            ref={fileInput}
                            accept="image/*, video/*, .pdf, .docx, .xlsx, .pptx, .txt, .zip , .zipx"
                            style={{ display: 'none' }}
                            // Invoke this when user has uploaded at least one file...
                            onChange={() => setRawFileList(fileInput.current!.files!)}
                        />
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Filename</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Uploaded at</strong>
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <FileListRows filenameMemo={filenameMemo} files={files} setFiles={setFiles} />
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
