import { LocalFile } from "./local-file";

export interface Collection {
    name: string;
    images: LocalFile[];
}