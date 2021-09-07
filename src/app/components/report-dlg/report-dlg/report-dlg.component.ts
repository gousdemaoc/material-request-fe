import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {DataService} from '../../../data-module/data.service';
import {Data} from '@angular/router';
@Component({
  selector: 'app-report-dlg',
  templateUrl: './report-dlg.component.html',
  styleUrls: ['./report-dlg.component.scss']
})
export class ReportDlgComponent implements OnInit, AfterViewInit {

  constructor(private ds: DataService) { }

  @Output() closeReport = new EventEmitter();

  reportData;
  reportHeaders;
  selectedMonth;


  months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'
  ]

  ngOnInit(): void {

    const today = new Date().toLocaleString('default', {month: 'long'}).toUpperCase();
    this.selectedMonth = today.toUpperCase();
  }

  ngAfterViewInit() {
    this.getReportData();
  }

  handleCloseDialog() {
    this.closeReport.emit();

  }

  handleMonthChange() {
    this.reportData = [];
    this.getReportData();
  }

  getReportData(){
    // console.log(this.selectedMonth);
    this.ds.getReportData(this.selectedMonth).subscribe( data => {
       // console.log(data);
      if(data && data.length) {
        this.reportHeaders = Object.getOwnPropertyNames(data[0])
        this.reportData = data;
      }

    });
  }

}
