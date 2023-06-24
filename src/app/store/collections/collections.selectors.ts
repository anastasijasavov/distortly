import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromCol from './collections.reducers';
import { Dictionary } from '@ngrx/entity';
import { CollectionDo } from 'src/app/dtos/collection.do';

export interface State {
  collections: fromCol.CollectionState;
}

export const reducers: ActionReducerMap<State> = {
  collections: fromCol.collectionReducer,
};

export const selectCollectionState =
  createFeatureSelector<fromCol.CollectionState>('collections');

export const selectColIds = createSelector(
  selectCollectionState,
  fromCol.selectCollectionIds
);

export const selectCollections = createSelector(
  selectCollectionState,
  fromCol.selectCollectionEntities
);


export const selectCollectionById = (id:string) => createSelector(
    selectCollections,
    (s: Dictionary<CollectionDo>) => s[id]
)