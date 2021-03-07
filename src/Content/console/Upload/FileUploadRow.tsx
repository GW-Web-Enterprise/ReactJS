import { PopoverItem } from '@app/Components/PopoverItem';
import { getSizeOfFiles } from '@app/utils/getSizeOfFiles';
import {
    Box,
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import { CloudUpload, Delete, Edit, GetApp, MoreVert } from '@material-ui/icons';
import { ReactNode, useRef, useState, VFC } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { CustomFileList } from '@app/typings/files';

const storageRef = firebase.storage().ref();

type Props = { open: boolean };
export const FileUploadRow: VFC<Props> = ({ open }) => {
    const filenameMemo = useRef<{ [key: string]: boolean }>({}); // memoize the filenames of uploaded files
    const fileInpRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<CustomFileList>([]);
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
                            <TableBody>{renderFileRows(files)}</TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};

const renderFileRows = (files: CustomFileList) => {
    if (!files.length) return;
    const rows: Array<ReactNode> = [];
    files.forEach(({ name: filename }, i) => {
        const extDot = filename.lastIndexOf('.');
        const extension = filename.slice(extDot);
        filename = filename.slice(0, extDot);
        rows.push(
            <TableRow key={i}>
                <TableCell component="th" scope="row">
                    {filename}
                </TableCell>
                <TableCell align="right">{extension}</TableCell>
                <TableCell align="right">{new Date().toLocaleString()}</TableCell>
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
                                    <ListItemIcon>
                                        <GetApp />
                                    </ListItemIcon>
                                    <ListItemText primary="Download" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <Edit />
                                    </ListItemIcon>
                                    <ListItemText primary="Rename" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <Delete />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete" />
                                </ListItem>
                            </List>
                        )}
                    />
                </TableCell>
            </TableRow>
        );
    });
    return rows;
};
