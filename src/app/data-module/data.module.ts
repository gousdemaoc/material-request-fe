import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {Store, StoreModule} from '@ngrx/store';
import {dataReducer} from './data.reducer';
import {userReducer} from './user.reducer';
import {EffectsModule} from '@ngrx/effects';
import {DataEffects} from './state/data.effects';
import {DataService} from './data.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('data', [userReducer, dataReducer]),
    EffectsModule.forFeature([DataEffects])
  ],
  providers: [ DataService ]
})
export class DataModule { }
