import { CommonModule } from '@angular/common';
import {Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import {Store} from '@ngrx/store';
import {getData} from '../../data-module/data.reducer';
import {UserState} from '../../data-module/state/Data.state';
import {fromEvent } from 'rxjs';
import {take} from 'rxjs/operators';
import * as DataActions from '../../data-module/state/data.actions';




@Component({
  selector: 'app-request-dlg',
  templateUrl: './request-dlg.component.html',
  styleUrls: ['./request-dlg.component.scss']
})

export class RequestDlgComponent implements OnInit, AfterViewInit {

  constructor(private store: Store<UserState>) { }

  @Output() closeOpenRequest = new EventEmitter();
  @Output() cancelOpenRequest = new EventEmitter();
  @Output() saveOpenRequest = new EventEmitter();

  @Input() selectedRequest;
  @Input() user;

  // Materials Variables
  @ViewChild('mat_search') mat_srch: ElementRef;
  @ViewChild('materialSelector') ms: ElementRef;
  materials:any=[];
  filteredMaterials:any=[];
  msIndex = 0;

  // Package Variables
  @ViewChild('pkg_search') pk_srch: ElementRef;
  @ViewChild('packageSelector') ps: ElementRef;
  packages:any=[];
  filteredPackages:any=[];
  psIndex = 0;

  @ViewChild('mat_qty') mat_qty: ElementRef;

  // Other Variables
  referenceDate: Date;
  materialRef: MaterialRef = {
  material: {
    INVENTORY_ITEM_ID: 0,
    ITEM_NO: '',
    DESCRIPTION: '',
    BULK_ITEM_ID: ''
  },
  package: {
    CONT_TYPE: '',
    CONT_MAX_VOL: '',
    PKG_TYPE: '',
    PKG_MAT: '',
    PKG_LID_CLASS: '',
    PKG_LINING_CLASS: '',
    PKG_OTHER_CLASS: ''
  },
  quantity: 0
};

  editQuantities = false;
  showNoItemDialog=false;

  ngOnInit(): void {
    this.store.dispatch(DataActions.loadMaterials());
    this.editQuantities = false;
    this.referenceDate = new Date('January 1, 1900');
    this.store.select(getData).subscribe( state => {
      console.log('state',state);
      if(state!==null){
      this.materials = state[1].products;
      this.packages = state[1].packages;

      //console.log(this.materials);
      this.psIndex = -1;
      this.msIndex = -1;
      }else{
        this.materials=[{
          ITEM_NO:'TEST',
          DESCRIPTION:'TEST'
        },
      {
          ITEM_NO:'TEST',
          DESCRIPTION:'TEST'
        }];
        this.packages=[];
      }
      
    });

    this.filteredMaterials = [];

    this.initializeNewMaterial();

    if (this.selectedRequest.request_id <= 0) {
      this.setRequiredByDate();
    }

  }
  ngAfterViewInit() {

    // console.log(this.selectedRequest);

    //if(this.selectedRequest.request_id <= 0 && this.selectedRequest.status === 'NEW')

    if(this.selectedRequest && this.selectedRequest.request_id <= 0){
      fromEvent(this.pk_srch.nativeElement, 'keydown').subscribe( res => {
        if(this.filteredPackages && this.filteredPackages.length > 0)
          // @ts-ignore
          switch (res.keyCode)
          {
            case 13:
              // this.pk_srch.nativeElement.value = (this.filteredPackages && this.filteredPackages.length) ? this.filteredPackages[this.psIndex]["CONT_TYPE"] : this.pk_srch.nativeElement.value;
              this.selectPackage(this.psIndex);
              break;
            case 40:
              // @ts-ignore
              Array.from(this.ps.nativeElement.children).map(elem => elem.classList.remove('selected'));
              this.psIndex = this.psIndex === this.ps.nativeElement.children.length - 1 ? 0 : this.psIndex + 1;
              if(this.ps.nativeElement.children.length > 0) this.ps.nativeElement.children[this.psIndex].setAttribute('class', 'selected');
              break;
            case 38:
              // console.log(`Starting: ${this.psIndex}`)
              // @ts-ignore
              Array.from(this.ps.nativeElement.children).map(elem => elem.classList.remove('selected'));
              this.psIndex = this.psIndex > -1 ? this.psIndex -1 : -1;
              // console.log(this.psIndex);
              if (this.psIndex >= 0 )
                if(this.ps.nativeElement.children.length > 0) this.ps.nativeElement.children[this.psIndex].setAttribute('class', 'selected');
              break;

          }
      })
      fromEvent(this.pk_srch.nativeElement, 'keyup').subscribe(res => {
        this.pk_srch.nativeElement.value = this.pk_srch.nativeElement.value.toUpperCase();

        // @ts-ignore
        switch(res.keyCode) {
          case 38:
          case 40:
          case 13:
            break;
          default:
            // @ts-ignore
            const search = res.target.value.toUpperCase();
            if (search && search.trim().length > 0) {
              this.filterPackages(search)
            } else
              this.filteredPackages = [];
            break;
        }
      });
      fromEvent(this.mat_srch.nativeElement, 'keydown').subscribe( res => {
        if(this.filteredMaterials && this.filteredMaterials.length > 0)
          // @ts-ignore
          switch (res.keyCode)
          {
            case 13:
              // console.log(`pressed enter`);
              this.mat_srch.nativeElement.value = (this.filteredMaterials && this.filteredMaterials.length) ? this.filteredMaterials[this.msIndex]["ITEM_NO"] : this.mat_srch.nativeElement.value;
              this.selectMaterial(this.msIndex);
              break;
            case 40:
              // @ts-ignore
              Array.from(this.ms.nativeElement.children).map(elem => elem.classList.remove('selected'));
              this.msIndex = this.msIndex === this.ms.nativeElement.children.length - 1 ? 0 : this.msIndex + 1;
              this.ms.nativeElement.children[this.msIndex].setAttribute('class', 'selected');
              break;
            case 38:
              // console.log(`Starting: ${this.msIndex}`)
              // @ts-ignore
              Array.from(this.ms.nativeElement.children).map(elem => elem.classList.remove('selected'));
              this.msIndex = this.msIndex > -1 ? this.msIndex -1 : -1;
              // console.log(this.msIndex);
              if (this.msIndex >= 0 )
                this.ms.nativeElement.children[this.msIndex].setAttribute('class', 'selected');
              break;

          }
      })
      fromEvent(this.mat_srch.nativeElement, 'keyup').subscribe( res => {
        // @ts-ignore
        switch(res.keyCode){
          case 38:
          case 40:
          case 13:
            break;
          default:
            this.mat_srch.nativeElement.value = this.mat_srch.nativeElement.value.toUpperCase();
            // @ts-ignore
            const search = res.target.value.toUpperCase();
            if(search && search.trim().length > 0){
              this.filterMaterials(search);
            }
            else
              this.filteredMaterials = [];
            break;
        }



      });
      fromEvent(this.mat_qty.nativeElement, 'input').subscribe( res => {

        // @ts-ignore
        this.materialRef.quantity = parseInt(res.target.value);
        // console.log(this.materialRef);
      })
    }


  }

  setRequiredByDate() {
    let daysToAdd = 3;
    let currentDate = new Date();
  
    while (daysToAdd > 0) {
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        daysToAdd--;
      }
    }
  
    this.selectedRequest.dtm_required = currentDate;
  }

  filterMaterials(search) {

      //Reset the selected Index on the materials list
      this.msIndex = -1;
      //Remove any selections that might be made already
      // @ts-ignore
    Array.from(this.ms.nativeElement.children).map(elem => elem.classList.remove('selected'));
    console.log('filtering',this.materials)
      this.filteredMaterials = this.materials.filter( mat => {
        return (
          mat.ITEM_NO.toUpperCase().startsWith(search.toUpperCase())
          || mat.DESCRIPTION.trim().toUpperCase().startsWith(search.trim().toUpperCase())
        );
      })
        .sort((a,b) => { return a["ITEM_NO"].localeCompare(b["ITEM_NO"])})
        .slice(0, 5);


      if(this.filteredMaterials.length > 1)
        this.materialRef.material = undefined;
      else if(this.filteredMaterials.length === 1){
        this.msIndex = 0;
        this.materialRef.material = this.filteredMaterials[this.msIndex];
        // @ts-ignore
        Array.from(this.ms.nativeElement.children).map(elem => elem.classList.remove('selected'));
        if(this.ms.nativeElement.children[0]) this.ms.nativeElement.children[0].setAttribute('class', 'selected');
      }



  }
  filterPackages(search) {

    this.filteredPackages = this.packages.filter(item => {
      return (
        item.CONT_TYPE.toUpperCase().startsWith(search)
      )
    })
      .sort((a,b) => { return a["CONT_TYPE"].localeCompare(b["CONT_TYPE"])})
      .slice(0, 5);

    if(this.filteredPackages.length > 1)
      this.materialRef.package = undefined;
    else if(this.filteredPackages.length === 1){
      this.psIndex = 0;
      this.materialRef.package = this.filteredPackages[this.psIndex];
      // @ts-ignore
      Array.from(this.ps.nativeElement.children).map(elem => elem.classList.remove('selected'));
      if(this.ps.nativeElement.children[0]) this.ps.nativeElement.children[0].setAttribute('class', 'selected');
    }


  }

  selectMaterial(index){

    this.mat_srch.nativeElement.value = this.filteredMaterials[index]['ITEM_NO'];
    this.filteredMaterials = this.filteredMaterials.filter( mat => { return (mat.ITEM_NO == this.filteredMaterials[index]['ITEM_NO'] && mat.DESCRIPTION == this.filteredMaterials[index]['DESCRIPTION'])});

    this.materialRef.material = this.filteredMaterials && this.filteredMaterials.length ? this.filteredMaterials[0] : undefined;

    // console.log(this.materialRef);

  }
  selectPackage(index = 0){
    // console.table(this.filteredPackages);
    // console.log(this.filteredPackages[index]['CONT_TYPE']);
    this.pk_srch.nativeElement.value = this.filteredPackages[index]['CONT_TYPE'];
    this.filteredPackages = this.filteredPackages.filter( pkg => { return (pkg.CONT_TYPE === this.pk_srch.nativeElement.value)});
    this.ps.nativeElement.children[0].setAttribute('class', 'selected');
    this.materialRef.package = this.filteredPackages && this.filteredPackages.length ? this.filteredPackages[0] : undefined;

    // console.log(this.materialRef);
  }


  addLineItem (){
    // alert('adding new line')
    // if(this.selectedRequest.request_id === -1){
    //   this.selectedRequest.request_id = 1;
    // }
    // if(this.materialRef.quantity===undefined){
    //   this.materialRef.quantity=0;

    // }
    console.log('adding new line')
    console.log(this.selectedRequest.lines.length)
    if(this.selectedRequest.lines.length < 4 && this.materialRef && this.materialRef.material && this.materialRef.package && this.materialRef.quantity && this.materialRef.quantity > 0){
      let requestLine = {
        request_id: this.selectedRequest.request_id,
        inventory_item_id: this.materialRef.material.ITEM_NO,
        item_desc: this.materialRef.material.DESCRIPTION,
        package_type_desc: this.materialRef.package.CONT_TYPE,
        requested_qty: this.materialRef.quantity,
        actual_qty: 0,
        fulfilled_weight: 0,
        received_qty: 0,
        fulfilled_by: "",
        received_by: ""
      }

      this.selectedRequest.lines.push(JSON.parse(JSON.stringify(requestLine)));
      requestLine = undefined;
      this.initializeNewMaterial();
    }else{
      console.log('No item to add')
    this.showNoItemDialog=true;

    }
  }
  deleteItem(index){
    this.selectedRequest.lines.splice(index, 1);
  }

  sortData(data, column) {
    return data && data.length ? (typeof data[0][column] === 'number') ? data.sort( (a,b) => { return a[column] - b[column]}) :  data.sort( (a,b) => { return a[column].localeCompare(b[column]) }) : null;
  }
  showDate(date){
    if(date)
    return this.referenceDate.getTime() < this.parseDate(date).getTime();
  }
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  handleCloseRequest(){
    this.closeOpenRequest.emit(this.selectedRequest);
  }

  handleCancelRequest(){
    this.cancelOpenRequest.emit(this.selectedRequest);
  }

  handleSaveRequest() {

    console.log(`inside handle Save`);

    console.log(this.selectedRequest);

    //return;

    this.selectedRequest.lines.forEach(item => {
      if (this.selectedRequest.status === 'PENDING') {
        this.selectedRequest.dtm_fulfilled = new Date()
        item.fulfilled_by = this.user.login;
      } else {
        this.selectedRequest.dtm_received =  new Date()
        item.received_by = this.user.login;
      }
    });

    this.saveOpenRequest.emit(this.selectedRequest);
  }

  initializeNewMaterial(){

    this.materialRef = {
      material: {
        INVENTORY_ITEM_ID: undefined,
        ITEM_NO: '',
        DESCRIPTION: '',
        BULK_ITEM_ID: ''
      },
      package: {
        CONT_TYPE: '',
        CONT_MAX_VOL: '',
        PKG_TYPE: '',
        PKG_MAT: '',
        PKG_LID_CLASS: '',
        PKG_LINING_CLASS: '',
        PKG_OTHER_CLASS: ''
      },
      quantity: 0
    }
    // It's not enough to initialized the object because of the functionality of the controls
    if(this.mat_srch){
      this.mat_srch.nativeElement.value = '';
      this.msIndex = - 1;
      this.filteredMaterials.length = 0;
    }

    if(this.pk_srch){
      this.pk_srch.nativeElement.value = '';
      this.psIndex = -1;
      this.filteredPackages.length = 0;
    }

    if(this.mat_qty)
      this.mat_qty.nativeElement.value = '';


  }

  closeNoItemDialog(){
    this.showNoItemDialog=false;
  }

}


export interface MaterialRef
{
  material: {
    INVENTORY_ITEM_ID: number,
    ITEM_NO: string,
    DESCRIPTION: string,
    BULK_ITEM_ID: string
  },
  package: {
    CONT_TYPE: string,
    CONT_MAX_VOL: string,
    PKG_TYPE: string,
    PKG_MAT: string,
    PKG_LID_CLASS: string,
    PKG_LINING_CLASS: string,
    PKG_OTHER_CLASS: string
  },
  quantity: number
}
