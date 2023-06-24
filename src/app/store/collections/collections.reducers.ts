import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as CollectionActions from './collections.actions';

import { CollectionDo } from 'src/app/dtos/collection.do';
import { LocalFile } from 'src/app/dtos/local-file';

export interface CollectionState extends EntityState<CollectionDo> {
  // additional state properties can be defined here
}

export const collectionAdapter: EntityAdapter<CollectionDo> =
  createEntityAdapter<CollectionDo>();

export const initialCollectionState: CollectionState =
  collectionAdapter.getInitialState({
    // additional initial state properties can be defined here
  });

export const collectionReducer = createReducer(
  initialCollectionState,
  on(CollectionActions.loadCollections, (state) => state),
  on(CollectionActions.addCollection, (state, { collection }) => {
    const col: CollectionDo = {
      ...collection,
      id:
        state.ids.length > 0 ? <number>state.ids[state.ids.length - 1] + 1 : 0,
    };
    console.log(state, col);

    return collectionAdapter.addOne(col, state);
  }),
  on(CollectionActions.updateCollection, (state, { id, changes }) => {
    debugger;
    const returnState = { ...state.entities };
    const col = <CollectionDo>{ ...returnState[id] };
    const image = <LocalFile>changes;
    var images = [];

    //deep copy images
    col.images!.forEach((element) => {
      images.push(element);
    });
    images?.push(image);
    col.images = images;
    returnState[id] = col;

    return {
      ...state,
      entities: { ...returnState },
    };
  }),
  on(CollectionActions.deleteCollection, (state, { id }) =>
    collectionAdapter.removeOne(id, state)
  )
);

const { selectIds, selectAll, selectEntities, selectTotal } =
  collectionAdapter.getSelectors();

// select the array of user ids
export const selectCollectionIds = selectIds;

// select the dictionary of user entities
export const selectCollectionEntities = selectEntities;

// select the array of users
export const selectAllCollections = selectAll;

// select the total user count
export const selectCollectionCount = selectTotal;
