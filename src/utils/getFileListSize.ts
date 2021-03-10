import { CustomFileList } from '@app/typings/files';
import { displayFileSize } from '@app/utils/displayFileSize';

export const getFileListSize = (fileList: CustomFileList) => {
    let nBytes = 0; // the size of each file is always in bytes
    fileList.forEach(({ size }) => (nBytes += size));
    let sOutput = nBytes + ' bytes';
    sOutput = displayFileSize(nBytes);
    return [sOutput, nBytes] as const;
};
