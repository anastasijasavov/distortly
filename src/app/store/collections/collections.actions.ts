import { createAction, props } from '@ngrx/store';
import { Collection } from 'src/app/dtos/collection.dto';

export const loadCollections = createAction('[Collection] Load Collections');

export const addCollection = createAction(
  '[Collection] Add Collection',
  props<{ collection: Collection }>()
);

export const updateCollection = createAction(
  '[Collection] Update Collection',
  props<{ id: string, changes: Partial<Collection> }>()
);

export const deleteCollection = createAction(
  '[Collection] Delete Collection',
  props<{ id: string }>()
);
