import { createAction, props } from '@ngrx/store';
import { UserSettings } from 'src/app/dtos/user.do';

export const loadUser = createAction('[Collection] Load User');


export const updateUser = createAction(
  '[User] Update User',
  props<{ props: UserSettings }>()
);
