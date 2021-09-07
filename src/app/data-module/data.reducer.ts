import {createReducer, createAction, on, createFeatureSelector, createSelector} from '@ngrx/store';
import {DataState, Product, Package} from './state/Data.state';
import * as DataActions from './state/data.actions';

const InitialDataState: DataState = {
  products: [
      {
        inventory_item_id :'',
        item_no: ''
      }
      ],
  packages: [
    {
      package_desc: '',
      package_id: -1
    }
  ]
};


const getDataState = createFeatureSelector<DataState>('data');

export const getData = createSelector(
  getDataState,
  state => state
)

export const getMaterials = createSelector(
  getDataState,
  state => state.products
)

export const getPackages = createSelector(
  getDataState,
  state => state.packages
)

export const dataReducer = createReducer<DataState>(
  InitialDataState,

  on(DataActions.loadMaterials, (state):DataState  => {
    return {
      ...state,
      products:  [{inventory_item_id :'', item_no: '' }]
    }
  }),

  on(DataActions.loadMaterialsSuccess, (state, action):DataState => {

    return {
      ...state,
      products: action.products
    }
  }),



on(DataActions.loadPackages, (state):DataState  => {
  return {
    ...state,
    packages:  [{package_id :-1, package_desc: '' }]
  }
}),

  on(DataActions.loadPackagesSuccess, (state, action):DataState => {

    return {
      ...state,
      packages: action.packages
    }
  })


)
