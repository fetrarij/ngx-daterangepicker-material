import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { NgxDaterangepickerMd, DaterangepickerDirective, DaterangepickerComponent } from './../../../src/daterangepicker';



describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let inputEl: DebugElement;
  let component: AppComponent;
  let daterangepicker: DaterangepickerDirective;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatCardModule,
        MatGridListModule,
        MatInputModule,
        MatSelectModule,
        NgxDaterangepickerMd
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    daterangepicker = fixture.componentInstance.daterangepicker;
  }));
  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as toolbar: 'Pure angular daterangepicker'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Pure angular daterangepicker');
  }));
  it('should render title in a mat-toolbar tag', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-toolbar').textContent).toContain('Pure angular daterangepicker');
  }));
  it('should open the daterangepicker', async(() => {
    inputEl.triggerEventHandler('click', null); 
    fixture.detectChanges();
    expect(daterangepicker.picker.isShown).toEqual(true);
  }));
  it('should select 2 dates in the daterangepicker', async(() => {
  }));
});
