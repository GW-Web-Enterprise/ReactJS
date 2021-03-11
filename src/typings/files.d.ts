/** These are the only file's metadata that we care about */
export type FileMetaData = {
    name: string;
    size: number;
    /** In ISO 8601 format */
    timeCreated: string;
    /** In ISO 8601 format */
    updated: string;
};

export type CustomFileList = Array<FileMetaData>;
