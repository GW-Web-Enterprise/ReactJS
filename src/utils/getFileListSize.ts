import { CustomFileList, FileMetaData } from '@app/typings/files';
import { displayFileSize } from '@app/utils/displayFileSize';

export const getFileListSize = (fileList: CustomFileList | FileList | Array<File> | Array<FileMetaData | File>) => {
    let nBytes = 0; // the size of each file is always in bytes
    // Spread syntax can be used on the built-in FileList: https://stackoverflow.com/a/58508451/8138591
    [...fileList].forEach(({ size }) => (nBytes += size));
    let sOutput = nBytes + ' bytes';
    sOutput = displayFileSize(nBytes);
    return [sOutput, nBytes] as const;
};
