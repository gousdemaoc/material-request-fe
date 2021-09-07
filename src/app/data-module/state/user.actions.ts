import {createAction, props} from '@ngrx/store';
import {UserState} from './Data.state';


//Actions for the User state
export const loadUserInfo = createAction(
  '[User] Load User Info');

export const loadUserInfoSuccess = createAction(
  '{User] Load User Success',
        props<{user: UserState }>()
  );

export const loadUserInfoFailure = createAction(
  '{User] Load User Failed',
        props<{error: string }>()
  );

export const setUserInfo = createAction(
  '[User] Set User Info from server',
        props<{user: UserState}>()
  );
