import { Component } from '@angular/core';
import {DataService} from './data-module/data.service';
import {Store} from '@ngrx/store';
import {UserState} from './data-module/state/Data.state';
import {getUser} from './data-module/user.reducer';
import * as UserActions from './data-module/state/user.actions';
import * as DataActions from './data-module/state/data.actions'
import {Router, ActivatedRoute, ActivationEnd, NavigationEnd} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MaterialRequestFE';
  constructor(private ds: DataService, private store: Store<UserState>, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {

    // this.router.navigate(['welcome']);

    // this.store.dispatch(UserActions.loadUserInfo());
    // this.store.dispatch(DataActions.loadMaterials());
    // this.store.dispatch(DataActions.loadPackages());
    //
    // this.store.select(getUser).subscribe( state => {
    //
    //   if(state && state[0] && state[0].last_name && state[0].emc_applications[0].emc_app_id == 201){
    //
    //     // console.log(`inside app.comp and state is true...`);
    //     this.router.navigate(['welcome']);
    //
    //   }
    //   else{
    //     setTimeout( () => {
    //       this.router.navigate(['nope']);
    //     });
    //   }
    //
    // });

  }

}
