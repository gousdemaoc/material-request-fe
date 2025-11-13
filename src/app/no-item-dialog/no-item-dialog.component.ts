import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-no-item-dialog',
  templateUrl: './no-item-dialog.component.html',
  styleUrls: ['./no-item-dialog.component.scss']
})
export class NoItemDialogComponent {
  @Output() close = new EventEmitter<void>();

  closeDialog() {
    this.close.emit();
  }
}
