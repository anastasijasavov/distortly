import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Collection } from 'src/app/dtos/collection.dto';
import * as CollectionActions from './collections.actions';

export interface CollectionState extends EntityState<Collection> {
  // additional state properties can be defined here
}

export const collectionAdapter: EntityAdapter<Collection> =
  createEntityAdapter<Collection>();

export const initialCollectionState: CollectionState =
  collectionAdapter.getInitialState({
    // additional initial state properties can be defined here
  });

export const collectionReducer = createReducer(
  initialCollectionState,
  on(CollectionActions.loadCollections, (state) => state),
  on(CollectionActions.addCollection, (state, { collection }) =>
  {
    console.log("EVO USLO");
    
     return collectionAdapter.addOne(collection, state)
  }
  ),
  on(CollectionActions.updateCollection, (state, { id, changes }) =>
    collectionAdapter.updateOne({ id, changes }, state)
  ),
  on(CollectionActions.deleteCollection, (state, { id }) =>
    collectionAdapter.removeOne(id, state)
  )
);
