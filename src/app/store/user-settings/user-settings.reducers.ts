import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as UserActions from './user-settings.actions';
import { UserSettings } from 'src/app/dtos/user.do';

export interface UserState extends UserSettings {
  // additional state properties can be defined here
}

export const collectionAdapter: EntityAdapter<UserSettings> =
  createEntityAdapter<UserSettings>();

export const initialState: UserState = {
  autoSave: true,
  filename: 'pic',
  fileType: 'JPG'
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state) => state),

  on(UserActions.updateUser, (state, {props}) => {
    return {
      ...state, ...props
    };
  })
);

const { selectIds, selectAll, selectEntities, selectTotal } =
  collectionAdapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserCount = selectTotal;
