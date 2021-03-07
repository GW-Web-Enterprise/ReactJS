import { getSizeOfFiles } from '@app/utils/getSizeOfFiles';
import { Box, Button, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { useRef, useState, VFC } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { CustomFileList } from '@app/typings/files';
import { FileRows } from '@app/Content/console/Upload/FileRows';

const storageRef = firebase.storage().ref();

type Props = { open: boolean };
export const FileUploadRow: VFC<Props> = ({ open }) => {
    const filenameMemo = useRef<{ [key: string]: boolean }>({}); // memoize the filenames of the uploaded files
    const fileInpRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<CustomFileList>([]);
    fileInpRef.current && (fileInpRef.current.value = ''); // clear the cache of file input when the 'files' state changes
    const handleLocalUpload = () => {
        // This function is invoked right after the user has uploaded at least one local file
        // File input is rendered so that the user can upload local files -> fileInpRef.current != null
        const validFiles: CustomFileList = [];
        const uploadedFiles = fileInpRef.current!.files!;
        for (let i = 0; i < uploadedFiles.length; i++) {
            const { name, type, size, lastModified } = uploadedFiles[i];
            if (!filenameMemo.current[name]) {
                filenameMemo.current[name] = true;
                validFiles.push({ name, size, type, lastModified, file: uploadedFiles[i] });
            }
        }
        validFiles.length && setFiles([...validFiles, ...files]);
    };
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom>
                            Your dropbox
                            <Box color="error.main" display="inline" fontSize="fontSize" ml={1}>
                                <strong>Status:</strong> pending
                            </Box>
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CloudUpload />}
                            onClick={() => fileInpRef.current?.click()}
                        >
                            Upload file
                        </Button>
                        <Typography variant="subtitle2" gutterBottom component="span" style={{ marginLeft: 8 }}>
                            Total size of uploaded files: {getSizeOfFiles(files)}
                        </Typography>
                        <input
                            type="file"
                            multiple
                            ref={fileInpRef}
                            accept="image/*, video/*, .pdf, .docx, .xlsx, .pptx, .txt, .zip , .zipx"
                            style={{ display: 'none' }}
                            onChange={handleLocalUpload}
                        />
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <strong>Filename</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Extension</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>Uploaded at</strong>
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <FileRows filenameMemo={filenameMemo} files={files} setFiles={setFiles} />
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
