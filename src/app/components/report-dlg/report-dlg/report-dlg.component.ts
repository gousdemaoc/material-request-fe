import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DataService } from '../../../data-module/data.service';

@Component({
  selector: 'app-report-dlg',
  templateUrl: './report-dlg.component.html',
  standalone: false,
  styleUrls: ['./report-dlg.component.scss']
})
export class ReportDlgComponent implements OnInit, AfterViewInit {

  constructor(private ds: DataService) {}

  @Output() closeReport = new EventEmitter();

  reportData: any[] = [];
  reportHeaders: string[];

  startDate: string;
  endDate: string;

  ngOnInit(): void {
    const today = new Date();

    // Default end date = today
    this.endDate = today.toISOString().substring(0, 10);

    // Default start date = last 30 days
    const start = new Date();
    start.setDate(start.getDate() - 30);
    this.startDate = start.toISOString().substring(0, 10);
  }

  ngAfterViewInit() {
    // Load last 30 days automatically
    this.getReportData();
  }

  onStartDateChange() {
    // You can add more logic here if necessary, such as logging or validation
    if (this.startDate) {
      // Optionally reset the end date when the start date changes
      this.endDate = this.endDate && this.endDate < this.startDate ? this.startDate : this.endDate;
    }
  }

  handleCloseDialog() {
    this.closeReport.emit();
  }

  triggerSearch() {
    if (!this.startDate || !this.endDate) {
      alert("Please select both Start Date and End Date.");
      return;
    }

    this.reportData = [];
    this.getReportData();
  }

  getReportData() {
    this.ds.getReportDataByDuration(this.startDate, this.endDate).subscribe(data => {
      if (data && data.length) {
        this.reportHeaders = Object.getOwnPropertyNames(data[0]);
        this.reportData = data;
      } else {
        this.reportData = [];
      }
    });
  }
}
