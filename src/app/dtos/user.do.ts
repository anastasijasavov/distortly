import { DitherParams } from './dither.dto';
import { FileType } from './file-type.dto';
import { FilterType } from './filter-type.enum';
import { PixelSort } from './pixel-sort.dto';
import { TriangulateParams } from './triangulate.dto';

export interface UserSettings {
  currentImage?: UserImage;
  filename: string;
  fileType: FileType;
  autoSave: boolean;
}

export interface UserImage {
  imageName: string;
  filterType: FilterType;
  params: ParamType;
}

export type ParamType = DitherParams | PixelSort | TriangulateParams | number;
