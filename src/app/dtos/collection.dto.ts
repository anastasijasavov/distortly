import { LocalFile } from "./local-file";

export interface Collection {
    id: number;
    name: string;
    images: LocalFile[];
}