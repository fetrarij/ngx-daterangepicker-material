import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, TimePeriod } from 'ngx-daterangepicker-material';

@Component({
  selector: 'demo-append-to-body',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './append-to-body.component.html',
  // position and overflow play the part of a parent that clips, like the wrapper of mat-form-field.
  styles: `
    .clipping-box {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 6px;
      height: 120px;
      padding: 12px;
      overflow: hidden;
      border: 1px dashed var(--mat-sys-outline);
      border-radius: 8px;
    }
  `
})
export class AppendToBodyComponent {
  selected = signal<TimePeriod | null>(null);
}
