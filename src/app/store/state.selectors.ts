import { createSelector } from '@ngrx/store';
import { collectionAdapter, CollectionState } from './collections.reducers';
import { AppState } from './reducers';

export const selectCollections = (state: AppState) => state.collections;

export const selectCollections = createSelector(
    selectCollectionState, 
    (state: CollectionState) => state.entities
)

export const { selectAll: selectAllCollections } =
  collectionAdapter.getSelectors(selectCollectionState);

export const selectCollectionCount = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.ids.length
);

export const selectLastId = createSelector(
  selectCollectionState,
  (state: CollectionState) => {
    return state.ids.length > 0 ? <number>state.ids.pop()! + 1 : 0;
  }
);
