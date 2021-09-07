import * as AppState from '../../state/app.state';

export interface UserState {
  employee_id: string,
  first_name: string,
  last_name: string,
  login: string,
  email: string,
  locid: number,
  plant_restricted: boolean,
  super_user: boolean,
  emc_applications: Array<EMC_Application>
}
export interface DataState {
  products: Product[];
  packages: Package[];
}

export interface Product {
  inventory_item_id: string,
  item_no: string
}
export interface Package {
  package_desc: string;
  package_id: number;
}

export interface EMC_Application {
  emc_app_id: number,
  emc_app_desc: string,
  emc_app_url: string,
  emc_access_level: number
}

export interface State extends AppState.State {
  data: DataState;
  user: UserState;
}
