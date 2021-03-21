import JSZip from 'jszip';
import firebase from 'firebase/app';
import { saveAs } from 'file-saver';

export const downloadFolderAsZip = async (folderPath: string, zipname?: string) => {
    const jszip = new JSZip();
    const folderRef = firebase.storage().ref(folderPath);
    const files = (await folderRef.listAll()).items;
    const downloadUrls: Array<string> = await Promise.all(
        files.map(({ name }) => folderRef.child(name).getDownloadURL())
    );
    const downloadedFiles = await Promise.all(downloadUrls.map(url => fetch(url).then(res => res.blob())));
    downloadedFiles.forEach((file, i) => jszip.file(files[i].name, file));
    const content = await jszip.generateAsync({ type: 'blob' });
    saveAs(content, zipname || folderPath);
};
