import {createAction, props} from '@ngrx/store';
import {DataState, Product, Package} from './Data.state';

export const loadMaterials = createAction(
  '[Data] Load Materials' );

export const loadMaterialsSuccess = createAction(
  '[Data] Load Materials Success',
    props<{products: Product[]}>()
);

export const loadMaterialsFailure = createAction(
  '[Data] Load Materials Failed',
  props<{error: string }>()
);

export const loadPackages = createAction(
  '[Data] Load Packages' );

export const loadPackagesSuccess = createAction(
  '[Data] Load Packages Success',
  props<{packages: Package[]}>()
);

export const loadPackagesFailure = createAction(
  '[Data] Load Packages Failed',
  props<{error: string }>()
);
