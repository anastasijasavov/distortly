import { createAction, props } from '@ngrx/store';
import p5 from 'p5';
import { UserImage, UserSettings } from 'src/app/dtos/user.do';

export const loadUser = createAction('[Collection] Load User');


export const updateUser = createAction(
  '[User] Update User',
  props<{ props: UserSettings }>()
);


export const saveImage = createAction(
    '[User] Update User Image',
    props<{image: UserImage}>()
)