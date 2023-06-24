import { ActionReducerMap } from '@ngrx/store';
import { CollectionState, collectionReducer } from './collections/collections.reducers';
import { UserState, userReducer } from './user-settings/user-settings.reducers';

export interface AppState {
  collections: CollectionState;
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  collections: collectionReducer,
  user: userReducer,
};