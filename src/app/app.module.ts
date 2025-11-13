import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DataModule } from './data-module/data.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NoAuthComponent } from './components/no-auth/no-auth.component';
import { HoverClassDirective } from './hover-class.directive';
import { RequestDlgComponent } from './components/request-dlg/request-dlg.component';
import { ReportDlgComponent } from './components/report-dlg/report-dlg/report-dlg.component';
import { DatePipe } from '@angular/common';
import { NoItemDialogComponent } from './no-item-dialog/no-item-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NoAuthComponent,
    HoverClassDirective,
    RequestDlgComponent,
    ReportDlgComponent,
    NoItemDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DataModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
