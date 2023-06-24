import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as UserActions from './user-settings.actions';
import { UserSettings } from 'src/app/dtos/user.do';


export interface UserState extends EntityState<UserSettings> {
  // additional state properties can be defined here
}

export const collectionAdapter: EntityAdapter<UserSettings> =
  createEntityAdapter<UserSettings>();

export const initialCollectionState: UserState =
  collectionAdapter.getInitialState({
    // additional initial state properties can be defined here
  });

export const userReducer = createReducer(
  initialCollectionState,
  on(UserActions.loadUser, (state) => state),

  on(UserActions.updateUser, (state, {id, changes }) =>
    collectionAdapter.updateOne({ id, changes }, state)
  ),
);
