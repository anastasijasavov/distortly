import { createAction, props } from '@ngrx/store';
import { Collection } from 'src/app/dtos/collection.dto';
import { LocalFile } from 'src/app/dtos/local-file';

export const loadCollections = createAction('[Collection] Load Collections');

export const addCollection = createAction(
  '[Collection] Add Collection',
  props<{ collection: Collection }>()
);

export const updateCollection = createAction(
  '[Collection] Update Collection',
  props<{ id: string, changes: Partial<LocalFile> }>()
);

export const deleteCollection = createAction(
  '[Collection] Delete Collection',
  props<{ id: string }>()
);
