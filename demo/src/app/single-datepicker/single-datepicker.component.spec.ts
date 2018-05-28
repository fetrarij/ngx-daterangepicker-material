import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDatepickerComponent } from './single-datepicker.component';

describe('SingleDatepickerComponent', () => {
  let component: SingleDatepickerComponent;
  let fixture: ComponentFixture<SingleDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
