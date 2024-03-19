import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserState } from '../../data-module/state/Data.state';
import { getUser } from '../../data-module/user.reducer';
import { DataService } from '../../data-module/data.service';
import { getData, getPackages } from '../../data-module/data.reducer';
import { fromEvent, Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as UserActions from '../../data-module/state/user.actions';
import * as DataActions from '../../data-module/state/data.actions';
import { DatePipe } from '@angular/common';
import { VersionService } from '../../services/version.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key.toUpperCase() === 'ESCAPE') {
      if (this.showDialog) {
        if (this.showNotes)
          this.closeDialog();
        else {
          this.closeDialog();
          if (!this.dlgMessage)
            this.clearSelectedRequest();
        }
      }
      else {
        this.closeSelectedRequest();
        //this.closeDialog();
      }
    }

  }

  @ViewChild('search') search: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('reqsearch') reqFilter: ElementRef;
  @ViewChild('backgroundInput') bg: ElementRef;

  user: UserState;
  version: string;
  dbVersion: string = environment.dbVersion;
  materials;
  materialSuggestions;

  packages;
  filteredMaterials;
  originalRequests;
  requests;

  request: MaterialRequest;
  selectedRequestItem;
  itemPackage;
  itemQTY;
  selectedRequest: MaterialRequest;
  referenceDate: Date;

  dlgMessage: string;

  fillRequest: boolean;
  recvRequest: boolean;
  showNotes: boolean;
  showDialog: boolean;
  showReport: boolean;
  dlgConfirm: Subject<boolean>;

  working: boolean;
  fromDate; toDate;
  today = new Date()

  plants = [
    { org_id: 285, plant: 'TNR' },
    { org_id: 85, plant: 'TNC' },
  ]

  constructor(private datePipe: DatePipe, private ds: DataService, private store: Store<UserState>, private router: Router, private route: ActivatedRoute, private versionService: VersionService) { }

  ngOnInit(): void {

    const id = this.route.snapshot.queryParamMap.get('requestID');
    // // console.log(`inside welcome the request ID we are looking for is: ${id}`);
    this.versionService.getVersion().subscribe(version => {
      this.version = version;
    });
    this.referenceDate = new Date('January 1, 1900');
    this.fillRequest = false;
    this.recvRequest = false;
    this.showNotes = false;
    this.showDialog = false;
    this.showReport = false;
    this.dlgConfirm = new Subject<boolean>();
    this.version = '1.0.2';
    this.store.select(getUser).subscribe(state => {
      if (state && state[0] && state[0].last_name && state[0].emc_applications[0].emc_app_id == 201) {
        this.user = state[0];
      console.log('USER--->', this.user)
      
        this.getAllRequests();
      }
      else {
        // // console.log(`we are going to nope`);
        if (!id) {
          // // console.log(`leaving welcome with no id`);
          this.router.navigate(['nope']);
        }
        else {
          // // console.log(`leaving welcome with id: ${id}`);
          this.router.navigate(['nope'], { queryParams: { requestID: id } });
        }


      }


    });

    this.store.dispatch(UserActions.loadUserInfo());
    this.store.dispatch(DataActions.loadMaterials());
    this.store.dispatch(DataActions.loadPackages());

    // this.getAllRequests();



    //this.filteredMaterials = [];

  }

  ngAfterViewInit() {

    //Dude ... this search functionality is on POINT!!
    fromEvent(this.reqFilter.nativeElement, 'keyup').subscribe(res => {
      // @ts-ignore
      const search = res.target.value;

      if (search && search.trim().length > 0) {
        this.requests = this.originalRequests.filter(item => {

          const options:Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          new Date().toLocaleDateString()
          return (
            item.request_id == search ||
            item.status.toUpperCase().includes(search.toUpperCase()) ||
            item.requested_by.toUpperCase().includes(search.toUpperCase()) ||
            this.translatePlant(item.org_id).toUpperCase() == search.toUpperCase() ||
            item.dtm_submitted.toLocaleString() == new Date(search).toLocaleString() ||
            item.dtm_fulfilled.toLocaleString() == new Date(search).toLocaleString() ||
            item.dtm_received.toLocaleString() == new Date(search).toLocaleString() ||
            item.dtm_required.toLocaleString() == new Date(search).toLocaleString() ||
            item.lines.some(l => l.inventory_item_id.toUpperCase().includes(search.toUpperCase())) ||
            item.lines.some(l => l.item_desc.toUpperCase().includes(search.toUpperCase())) ||
            item.lines.some(l => l.package_type_desc.toUpperCase().includes(search.toUpperCase())) ||
            (new Date(item.dtm_submitted).getFullYear() > 2019 && new Date(item.dtm_submitted).toLocaleDateString(undefined, options).toUpperCase().includes(search.toUpperCase())) ||
            (new Date(item.dtm_fulfilled).getFullYear() > 2019 && new Date(item.dtm_fulfilled).toLocaleDateString(undefined, options).toUpperCase().includes(search.toUpperCase())) ||
            (new Date(item.dtm_received).getFullYear() > 2019 && new Date(item.dtm_received).toLocaleDateString(undefined, options).toUpperCase().includes(search.toUpperCase())) ||
            (new Date(item.dtm_required).getFullYear() > 2019 && new Date(item.dtm_required).toLocaleDateString(undefined, options).toUpperCase().includes(search.toUpperCase()))
          )
        })
      } else {
        this.requests = JSON.parse(JSON.stringify(this.originalRequests));

      }
      if (this.requests.length)
        this.sortData(this.requests, 'request_id');
    });

    /*fromEvent(this.search.nativeElement, 'keypress').subscribe( res => {

      // @ts-ignore
      const search = res.target.value;

      if(this.materials && this.materials.length > 100 && search.length > 0){
        this.materialSuggestions = this.materials.filter( mat => {
          return (
            mat.ITEM_NO.toUpperCase().startsWith(search.toUpperCase()) ||
            mat.INVENTORY_ITEM_ID == search.toUpperCase() ||
            mat.DESCRIPTION.trim().toUpperCase().startsWith(search.trim().toUpperCase()) ||
            mat.BULK_ITEM_NO.trim().toUpperCase().startsWith(search.trim().toUpperCase())
          );
        });
        if(this.materialSuggestions && this.materialSuggestions.length > 1)
          this.sortData(this.materialSuggestions, 'DESCRIPTION')
        if(this.materialSuggestions && this.materialSuggestions.length === 1){
          this.selectedRequestItem = this.materialSuggestions[0].ITEM_NO
          this.materialSuggestions = [];
        }



        //// console.log(this.materialSuggestions);
      }else {
        this.materialSuggestions = [];
      }
    })*/

  }
  getAllRequests() {
    // this.ds.getAllRequests().subscribe( data => {
    // console.log("Fetching all open requests")
    this.ds.getOpenRequests().subscribe(data => {
      this.originalRequests = this.user.emc_applications[0].emc_access_level === 1 ? data : data.filter(item => item.status === 'PENDING');
      
      console.log('USER--->', this.user )
      console.log('getAllRequests--->', this.originalRequests )

      this.requests = JSON.parse(JSON.stringify(this.originalRequests));
      // console.table(this.requests);
      this.sortData(this.requests, 'request_id');
      //this.sortData(this.requests, 'dtm_submitted');
      if (this.route.snapshot.queryParamMap.get('requestID')) {
        const id = parseInt(this.route.snapshot.queryParamMap.get('requestID'));
        // this.clearSelectedRequest();
        this.selectRequestItem(id);
      }

    })
  }

  getRequestByDate() {
    if (this.fromDate != undefined && this.toDate != undefined) {
      this.ds.getAllRequestsByDate({ fromDate: this.fromDate, toDate: this.toDate }).subscribe(data => {
      
        this.originalRequests = this.user.emc_applications[0].emc_access_level === 1 ? data : data.filter(item => item.status === 'PENDING');
        console.log('USER--->', this.user )
        console.log('getAllRequestsByDate--->', this.originalRequests )

        this.requests = JSON.parse(JSON.stringify(this.originalRequests));
        // console.table(this.requests);
        this.sortData(this.requests, 'request_id');
        //this.sortData(this.requests, 'dtm_submitted');
        if (this.route.snapshot.queryParamMap.get('requestID')) {
          const id = parseInt(this.route.snapshot.queryParamMap.get('requestID'));
          // this.clearSelectedRequest();
          this.selectRequestItem(id);
        }

      })
    }
  }

  // Request actions
  initializeNewRequest() {
    this.selectedRequest = {
      request_id: -1,
      requested_by: `${this.user.login}`,
      org_id: 285,
      status: 'NEW',
      dtm_submitted: new Date(),
      dtm_required: new Date(),
      dtm_fulfilled: null,
      dtm_received: null,
      notes: '',
      lines: new Array<MatReqLines>()
    }
  }
  selectRequestItem(id) {
    try {
      // console.log(`inside selectRequest with id: ${id}`);
      this.selectedRequest = JSON.parse(JSON.stringify(this.requests.find(item => { return item.request_id === id })));
      this.fillRequest = this.showDate(this.selectedRequest.dtm_fulfilled);
      this.recvRequest = this.showDate(this.selectedRequest.dtm_received);
      //// console.log(this.selectedRequest);
    }
    catch (e) {
      //console.error(e.message)
    }

  }

  // Lines
  // addLineItem (){
  //   if(this.selectedRequest && this.selectedRequest.status === 'NEW' && this.selectedRequest.lines.length < 4 && this.selectedRequestItem && this.selectedRequestItem.trim().length > 0 && this.itemPackage && this.itemQTY > 0){
  //     const inventory_item_id = this.materials.filter(item => item.ITEM_NO === this.selectedRequestItem).map(out => out.INVENTORY_ITEM_ID)[0] ? this.materials.filter(item => item.ITEM_NO === this.selectedRequestItem).map(out => out.INVENTORY_ITEM_ID)[0] : '';
  //     let requestLine = {
  //       request_id: this.selectedRequest.request_id,
  //       inventory_item_id: inventory_item_id,
  //       item_desc: this.selectedRequestItem,
  //       package_type_desc: this.itemPackage,
  //       requested_qty: this.itemQTY,
  //       actual_qty: 0,
  //       received_qty: 0,
  //       fulfilled_by: "",
  //       received_by: ""
  //     }
  //
  //     this.selectedRequest.lines.push(JSON.parse(JSON.stringify(requestLine)));
  //     requestLine = undefined;
  //     this.itemQTY = 0;
  //     this.itemPackage = undefined;
  //     this.selectedRequestItem = undefined;
  //
  //
  //   }
  //   else {
  //
  //   }
  //
  // }
  // deleteItem(index){
  //   this.dlgMessage = `Are you sure you want to delete this row?`;
  //   this.showDialog = true;
  //
  //   this.dlgConfirm.pipe(take(1)).subscribe( val=> {
  //     if(val === true)
  //       this.selectedRequest.lines.splice(index, 1);
  //
  //     this.dlgMessage = undefined;
  //     this.showDialog = false;
  //   });
  //
  // }
  // markLinesAsFilled(){
  //
  //   this.selectedRequest.dtm_fulfilled = new Date();
  //   this.selectedRequest.lines.forEach( l => {
  //     l.fulfilled_by = this.user.login;
  //   });
  //
  //   //this.selectRequestItem(request_id);
  // }
  markLinesAsReceived() {
    // console.log(this.selectedRequest);
    this.selectedRequest.dtm_received = new Date();
    this.selectedRequest.lines.forEach(l => {
      l.received_by = this.user.login;
    });
  }

  validateLines(): boolean {
    let valid: boolean = false;

    switch (this.user.emc_applications[0].emc_access_level) {
      case 1:
        if (this.selectedRequest.status === 'NEW' && this.selectedRequest.lines.length > 0)
          valid = true;
        else valid = (this.selectedRequest.status === 'FILLED' && this.selectedRequest.lines.some(item => item.received_qty > 0));
        break;
      case 2:
        valid = (this.selectedRequest.status === 'PENDING' && this.selectedRequest.lines.some(item => item.actual_qty > 0))
        break;
    }
    return valid;
  }

  // Form actions
  closeSelectedRequest() {

    const id = this.selectedRequest.request_id;

    const original = JSON.stringify(this.requests.find(r => r.request_id === id));
    const current = JSON.stringify(this.selectedRequest);

    this.dlgMessage = (original != current) ? `Are you sure you want to close the current request without saving your changes??` : `Are you sure you want to close this request?`;
    this.showDialog = true;

    this.dlgConfirm.pipe(take(1)).subscribe(val => {
      if (val === true)
        this.clearSelectedRequest();

      this.dlgMessage = undefined;
      this.showDialog = false;
    });

  }
  clearSelectedRequest() {
    this.initializeNewRequest();
    this.selectedRequest = undefined;

  }
  saveSelectedRequest() {

    const action = this.selectedRequest.status === 'NEW' ? 'N' : this.selectedRequest.status === 'PENDING' ? 'P' : this.selectedRequest.status === 'FILLED' ? 'F' : this.selectedRequest.status === 'CANCELLED' ? 'C' : '';

    if (this.validateLines()) {
      this.working = true;
      this.openDialog();
      this.ds.saveRequest(this.selectedRequest, action)
        .subscribe(val => {
          // console.log(val);
          this.clearSelectedRequest();
          this.getAllRequests();

          this.closeDialog();
          this.working = false;

        })
    }
    else {
      // console.log(`there was an issue with the request object below: `);
      // console.log(this.selectedRequest);
    }

  }
  cancelRequest() {
    if (this.selectedRequest.status === 'FILLED') return
    else {
      this.dlgMessage = `Are you sure you want to cancel the current request??`;
      this.showDialog = true;

      this.dlgConfirm
        .pipe(take(1))
        .subscribe(val => {
          if (val === true) {
            this.dlgMessage = undefined;
            this.closeDialog();
            this.working = true;
            this.openDialog();
            this.ds.cancelRequest(this.selectedRequest, 'C')
              .subscribe(val => {
                // console.log(val);
                this.clearSelectedRequest();
                this.getAllRequests();

                this.closeDialog();
                this.working = false;
                // if(val === 'SUCCESS'){
                //
                // }

              });
          }
          else {
            this.dlgMessage = undefined;
            this.closeDialog();
          }
        });
    }
  }

  closeRequestDialog(e) {
    this.selectedRequest = e;
    this.closeSelectedRequest();
  }

  closeReportDialog(e) {
    this.showReportToggle();
  }
  cancelRequestFromDialog(e) {

    this.selectedRequest = e;
    this.cancelRequest();
  }
  saveRequestFromDialog(e) {
    // console.log(`inside save in welcome!`);
    this.selectedRequest = e;

    // console.log(`valid? ${this.validateLines()}`);

    // console.log(this.selectedRequest);

    this.saveSelectedRequest();
  }

  // Dialog actions
  openNotes() {
    this.dlgMessage = undefined;
    this.showNotes = true;
    this.openDialog();
  }
  openDialog() {
    // console.log('inside open dialog');
    this.showDialog = true;
  }
  closeDialog() {
    this.showNotes = this.showDialog = false;

  }

  // Utility Functions
  showDate(date) {
    return this.referenceDate.getTime() < this.parseDate(date).getTime();
  }
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  translatePlant(val) {
    return this.plants.find(item => item.org_id == val).plant;
  }

  sortData(data, column) {
    if (data && data.length)
      return (typeof data[0][column] === 'number') ? data.sort((a, b) => { return a[column] - b[column] }) : data.sort((a, b) => { return a[column].localeCompare(b[column]) });
  }
  searchKeyUp() {
    /*if(this.materials && this.materials.length > 100 && this.selectedRequestItem.length > 0){
      this.materialSuggestions = this.materials.filter( mat => {
        return (
          mat.ITEM_NO.toUpperCase().startsWith(this.selectedRequestItem.toUpperCase()) ||
          mat.INVENTORY_ITEM_ID == this.selectedRequestItem.toUpperCase() ||
          mat.DESCRIPTION.trim().toUpperCase().startsWith(this.selectedRequestItem.trim().toUpperCase()) ||
          mat.BULK_ITEM_NO.trim().toUpperCase().startsWith(this.selectedRequestItem.trim().toUpperCase())
        );
      });
      if(this.materialSuggestions && this.materialSuggestions.length > 1)
        this.sortData(this.materialSuggestions, 'DESCRIPTION')
      if(this.materialSuggestions && this.materialSuggestions.length === 1){
        this.selectedRequestItem = this.materialSuggestions[0].ITEM_NO
        this.materialSuggestions = [];
      }
      //// console.log(this.materialSuggestions);
    }else {
      this.materialSuggestions = [];
    }*/


    if (this.selectedRequestItem.length > 0) {
      this.selectedRequestItem = this.selectedRequestItem.toUpperCase();
      let suggestions = this.materials.map(mat => mat.ITEM_NO).filter(mat => mat.toUpperCase().startsWith(this.selectedRequestItem)).sort();

      if (suggestions.length > 0)
        this.bg.nativeElement.value = (this.selectedRequestItem + suggestions[0].substring(this.selectedRequestItem.length));
      else
        this.bg.nativeElement.value = '';
    }
    else
      this.bg.nativeElement.value = '';



  }
  blurSearch(val) {
    if (val)
      this.selectedRequestItem = val.toUpperCase();
    else
      this.selectedRequestItem = this.selectedRequestItem.toUpperCase();

    this.search.nativeElement.blur();
    this.materialSuggestions = [];
  }
  blurMaterialSearch() {
    if (this.bg.nativeElement.value) {
      this.selectedRequestItem = this.bg.nativeElement.value;
      this.bg.nativeElement.value = '';
    }
  }

  showReportToggle() {
    this.showReport = !this.showReport;
  }
}


export interface MaterialRequest {
  request_id: number,
  requested_by: string,
  org_id: number,
  status: string,
  dtm_submitted: Date,
  dtm_required: Date,
  dtm_fulfilled: Date,
  dtm_received: Date,
  notes: string,
  lines: Array<MatReqLines>
}
export interface MatReqLines {
  request_id: number,
  inventory_item_id: string,
  item_desc: string,
  package_type_desc: string,
  requested_qty: number,
  actual_qty: number,
  fulfilled_weight: number,
  received_qty: number,
  fulfilled_by: string,
  received_by: string
}
