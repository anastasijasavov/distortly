import {
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
  } from '@ngrx/store';
  import * as fromUser from './user-settings.reducers';
  
  export interface State {
    user: fromUser.UserState;
  }
  
  export const reducers: ActionReducerMap<State> = {
    user: fromUser.userReducer,
  };
  
  export const selectUserState =
    createFeatureSelector<fromUser.UserState>('user');
  
  