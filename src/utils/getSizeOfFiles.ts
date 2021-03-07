import { CustomFileList } from '@app/typings/files';

export const getSizeOfFiles = (fileList: CustomFileList) => {
    if (!fileList.length) return '0 byte';
    let nBytes = 0; // the size of each file is always in bytes
    fileList.forEach(({ size }) => (nBytes += size));
    let sOutput = nBytes + ' bytes';
    // optional code for multiples approximation
    const aMultiples = ['KB', 'MB', 'GB'] as const;
    for (let nMultiple = 0, nApprox = nBytes / 1000; nApprox > 1; nApprox /= 1000, nMultiple++) {
        // 10^3 bytes/1000^1 = 1 KB, 10^6 bytes/1000^2 = 1MB, 10^9 bytes/1000^3 = 1GB
        sOutput = nApprox.toFixed(3) + ' ' + aMultiples[nMultiple];
    }
    return sOutput;
};
