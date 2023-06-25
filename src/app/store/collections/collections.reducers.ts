import { createReducer, on } from '@ngrx/store';
import {
  EntityState,
  EntityAdapter,
  createEntityAdapter,
  Dictionary,
} from '@ngrx/entity';
import * as CollectionActions from './collections.actions';

import { CollectionDo } from 'src/app/dtos/collection.do';

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
    return collectionAdapter.addOne(col, state);
  }),
  on(CollectionActions.updateCollection, (state, { id, changes }) => {
    const returnState = { ...state.entities };
    const col = <CollectionDo>{ ...returnState[id] };
    const image = <string>changes;
    var images = [];

    //deep copy images
    col.images!.forEach((element) => {
      images.push(element);
    });
    images?.push(image);
    col.images = images;

    return collectionAdapter.updateOne({ id, changes: col }, state);
  }),
  on(CollectionActions.deleteCollection, (state, { id }) =>
    collectionAdapter.removeOne(id, state)
  ),
  on(CollectionActions.removeFromCollection, (state, { id, name }) => {
    const returnState = { ...state.entities };
    const col = <CollectionDo>{ ...returnState[id] };
    var images: string[] = [];

    //deep copy images
    col.images!.forEach((element) => {
      if (element !== name) {
        images.push(element);
      }
    });
    col.images = images;

    return collectionAdapter.updateOne({ id, changes: col }, state);
  }),
  on(CollectionActions.renameCollection, (state, { id, col }) => {
    return collectionAdapter.updateOne({ id, changes: col }, state);
  }),
  on(CollectionActions.removeImageFromCollections, (state, { name }) => {
    const returnState = { ...state };
    const collections = { ...state.entities };
    var updatedCollections: Dictionary<CollectionDo> = {};

    Object.keys(collections).forEach((key) => {
      const newCol: CollectionDo = {
        name: collections[key]?.name!,
        id: parseInt(key),
        images: collections[key]?.images.filter((x) => x !== name)!,
      };
      updatedCollections[key] = newCol;
    });

    returnState.entities = updatedCollections;
    return returnState;
  })
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
