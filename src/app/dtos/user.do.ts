import { FileType } from "./file-type.dto";
import { LocalFile } from "./local-file";

export interface UserSettings {
    currentImage?: LocalFile;
    filename: string;
    autoSave: boolean;
    fileType: FileType;
}