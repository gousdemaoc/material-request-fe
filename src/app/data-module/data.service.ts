import { Injectable } from '@angular/core';
//import { DataModule } from './data.module';
import {HttpClient} from '@angular/common/http';
import {DataState, Package, Product, UserState} from './state/Data.state';
import {Observable} from 'rxjs';
import {MaterialRequest} from '../components/welcome/welcome.component';
import { AppConfig } from '../config';

@Injectable()
export class DataService {

  private server: string[] = [ 'http://alphaapps.aoc-resins.com/','http://aoccol-181x.aoc-resins.com/','https://localhost:44348/', 'http://aoccol-181sc.aoc-resins.com/','http://dev.alphaapps.aoc-resins.com/'  ];
  private serverIndex: number = AppConfig.serverIndex;
  private app: string = AppConfig.app;
//private app: string = 'MaterialRequestBE/api/';
  private monthlyRequest:string='MonthlyRequests/'
  //private app: string = 'api/';
  private appID: string = '201'
  dbVersion: string= "";
  constructor(private http: HttpClient) { }

  getEmployeeInfo():Observable<UserState> {
    return this.http.get<UserState>(`${this.server[this.serverIndex]}${this.app}initialize?id=${this.appID}`) ;
  }

  getAllMaterials(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.server[this.serverIndex]}${this.app}searchMaterials?filter&id=30`);
  }

  getAllPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.server[this.serverIndex]}${this.app}packages`);
  }

  getAllRequests(): Observable<any> {
    return this.http.get<any>(`${this.server[this.serverIndex]}${this.app}requests`);
  }

  getAllRequestsByDate(r): Observable<any> {
    return this.http.get<any>(`${this.server[this.serverIndex]}${this.app}${this.monthlyRequest}${r.fromDate}/${r.toDate}`);
  }

  saveRequest(r, action){
    return this.http.post(`${this.server[this.serverIndex]}${this.app}requests?action=${action}`,r);
  }

  getOpenRequests(): Observable<any> {
    return this.http.get<any>(`${this.server[this.serverIndex]}${this.app}openrequest`);
  }

  getReportData(month) : Observable<any> {
    return this.http.get<any>( `${this.server[this.serverIndex]}${this.app}monthlyrequests/${month}`);
  }

  getFulfilledRequests(): Observable<any> {
    return this.http.get<any>(`${this.server[this.serverIndex]}${this.app}fulfilledrequest`);
  }

  cancelRequest(r, action) {
    return this.http.post(`${this.server[this.serverIndex]}${this.app}requests?action=${action}`,r);
  }

  sortBy(column, data){
    data = data.sort( (a,b) => { return a[column] < b[column] });
  }

}
