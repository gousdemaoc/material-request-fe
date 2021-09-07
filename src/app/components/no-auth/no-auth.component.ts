import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {UserState} from '../../data-module/state/Data.state';
import {getUser} from '../../data-module/user.reducer';

@Component({
  selector: 'app-no-auth',
  templateUrl: './no-auth.component.html',
  styleUrls: ['./no-auth.component.scss']
})
export class NoAuthComponent implements OnInit {

  user: UserState;
  showMessage = false;
  timer;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<UserState>) { }

  ngOnInit(): void {

    this.timer = setTimeout( () => {this.showMessage = true}, 3000);

    const id = this.route.snapshot.queryParamMap.get('requestID');


    this.store.select(getUser).subscribe( state => {

      if (state && state[0] && state[0].last_name && state[0].emc_applications[0].emc_app_id == 201) {
        this.showMessage = false;
        clearTimeout(this.timer);

        if(id){
          this.router.navigate(['welcome'], { queryParams: {requestID: id}})
        }
        else
        {
          this.router.navigate(['welcome']);
        }

      }
    });

  }

}
