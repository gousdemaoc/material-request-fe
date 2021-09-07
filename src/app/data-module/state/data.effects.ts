import { Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as UserActions from './user.actions';
import * as DataActions from './data.actions';
import {DataService} from '../data.service';
import {map, mergeMap} from 'rxjs/operators';

@Injectable()
export class DataEffects {
    constructor(private user_actions$: Actions, private data_actions$: Actions, private ds: DataService) { }

    loadMaterials$ = createEffect(() => {
      return this.data_actions$
        .pipe(
          ofType(DataActions.loadMaterials),
          mergeMap(() => this.ds.getAllMaterials()
            .pipe (
              map(products => DataActions.loadMaterialsSuccess( { products }))
            )
          )
        )
    })

  loadPackages$ = createEffect( () => {
    return this.data_actions$
      .pipe(
        ofType(DataActions.loadPackages),
        mergeMap( () => this.ds.getAllPackages()
          .pipe(
            map( packages => DataActions.loadPackagesSuccess( {packages}))
          )
        )
      )
  })

    loadUser$ = createEffect(() => {
      return this.user_actions$
        .pipe(
          ofType(UserActions.loadUserInfo),
          mergeMap(() => this.ds.getEmployeeInfo()
            .pipe (
              map(user => UserActions.loadUserInfoSuccess({ user }))
            )
          )
        )
    })

}
