/**
 * This CustomFile type is developed from the built-in File type
 */
interface CustomFile {
    name: string;
    /** File size in bytes */
    size: number;
    /** Unique file type specifiers
     * @tutorial https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
     */
    type: string;
    /** UTC miliseconds */
    lastModified: number;
    /** The actual content of the local file uploaded from users */
    file: File;
}

/** An array version of the built-in FileList object value of input.files. This version makes it much easier to
 * work with a list of files using the Array.prototype.* methods
 */
export type CustomFileList = Array<CustomFile>;
