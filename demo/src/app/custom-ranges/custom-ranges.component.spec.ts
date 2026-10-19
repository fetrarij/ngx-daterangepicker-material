import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { CustomRangesComponent } from './custom-ranges.component';

describe('CustomRangesComponent', () => {
  let component: CustomRangesComponent;
  let fixture: ComponentFixture<CustomRangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomRangesComponent, NgxDaterangepickerMd.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
