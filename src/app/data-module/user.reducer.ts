import {createReducer, createAction, on, createFeatureSelector, createSelector} from '@ngrx/store';
import {UserState, EMC_Application} from './state/Data.state';
import * as UserActions from './state/user.actions';

const InitialUserState: UserState = {
  employee_id: '',
  first_name: '',
  last_name: '',
  login: '',
  email: '',
  locid: -1,
  plant_restricted: false,
  super_user: false,
  dbVersion: '',
  serverName: '',
  emc_applications: [
    {
      emc_app_id: -1,
      emc_app_desc: '',
      emc_app_url: '',
      emc_access_level: -1
    }
  ]
};


const getUserState = createFeatureSelector<UserState>('data');

export const getUser = createSelector(
  getUserState,
  state => state
);

export const userReducer = createReducer<UserState>(
  InitialUserState,

  on(UserActions.loadUserInfo, (state):UserState => {
    return {
      ...state
    }
  }),

  on(UserActions.setUserInfo, (state, action):UserState => {
    return {

      employee_id: action.user.employee_id,
      first_name: action.user.first_name,
      last_name: action.user.last_name,
      email: action.user.email,
      login: action.user.login,
      locid: action.user.locid,
      dbVersion: action.user.dbVersion,
      serverName: action.user.serverName,
      plant_restricted: action.user.plant_restricted,
      super_user: action.user.super_user,
      emc_applications: action.user.emc_applications
    }
  }),

  on(UserActions.loadUserInfoSuccess, (state, action):UserState => {
    if(action.user && action.user != undefined)
    return {
      ...state,
      employee_id: action.user.employee_id,
      first_name: action.user.first_name,
      last_name: action.user.last_name,
      email: action.user.email,
      login: action.user.login,
      locid: action.user.locid,
      plant_restricted: action.user.plant_restricted,
      super_user: action.user.super_user,
      emc_applications: action.user.emc_applications
    }
  })

)
