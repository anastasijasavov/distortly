import { LocalFile } from "./local-file";

export interface CollectionDto {
    name: string;
    images: LocalFile[];
    checked?: boolean;
}