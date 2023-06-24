import { FilterType } from "./filter-type.enum";

export interface FilterParam {
  filterType: FilterType,
  level: number
}