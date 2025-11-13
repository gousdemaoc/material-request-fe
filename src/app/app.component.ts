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
  loggedInUser: string = 'N/A';
  dbVersion: string = 'N/A';
  serverName: string = 'N/A';

  constructor(private ds: DataService, private store: Store<UserState>, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {


    this.ds.getEmployeeInfo().subscribe(identity => {
      if (identity) {
        this.loggedInUser = identity.login;
        this.dbVersion = identity.dbVersion || 'N/A';
        this.serverName = identity.serverName || 'N/A';
      }
    });

  }
}
