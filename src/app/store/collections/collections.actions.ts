import { createAction, props } from '@ngrx/store';
import { CollectionDo } from 'src/app/dtos/collection.do';

export const loadCollections = createAction('[Collection] Load Collections');

export const addCollection = createAction(
  '[Collection] Add Collection',
  props<{ collection: CollectionDo }>()
);

export const updateCollection = createAction(
  '[Collection] Update Collection',
  props<{ id: string, changes: Partial<string> }>()
);

export const deleteCollection = createAction(
  '[Collection] Delete Collection',
  props<{ id: string }>()
);



export const removeFromCollection = createAction(
  '[Collection] Delete Collection',
  props<{id:string, name: string }>()
);

export const removeImageFromCollections = createAction(
  '[Collection] Remove Image From Collections',
  props<{name: string }>()
);
export const renameCollection = createAction(
  '[Collection] Rename Collection',
  props<{id:string, col: CollectionDo}>()
);
