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
import { NgxDaterangepickerMd } from './../../../src/daterangepicker';



describe('AppComponent', () => {
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
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as toolbar: 'Pure angular daterangepicker'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Pure angular daterangepicker');
  }));
  it('should render title in a mat-toolbar tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-toolbar').textContent).toContain('Pure angular daterangepicker');
  }));
});
