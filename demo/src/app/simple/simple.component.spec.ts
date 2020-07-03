import { async, ComponentFixture, fakeAsync, TestBed, tick, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from '../../../../src/daterangepicker';
import { SimpleComponent } from './simple.component';
import { SimpleExampleComponent } from '../examples/simple-example.component';
import { SimpleInlineExampleComponent } from '../examples/simple-inline-example.component';
import { SimpleInlineTimepickerExampleComponent } from '../examples/simple-inline-timepicker-example.component';
import { ExampleComponent } from '../example/example.component';
import {Overlay, OverlayContainer} from '@angular/cdk/overlay';
import { MatCheckboxModule } from '@angular/material/checkbox';


describe('SimpleComponent', () => {
    let component: SimpleComponent;
    let fixture: ComponentFixture<SimpleComponent>;
    let input: HTMLInputElement;


    let overlayContainer: OverlayContainer;
    let overlayContainerElement: HTMLElement;

    afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
        currentOverlayContainer.ngOnDestroy();
        overlayContainer.ngOnDestroy();
      }));
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SimpleComponent,
                SimpleExampleComponent,
                SimpleInlineExampleComponent,
                SimpleInlineTimepickerExampleComponent,
                ExampleComponent
            ],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgxDaterangepickerMd.forRoot(),
                BrowserAnimationsModule,
                MatToolbarModule,
                MatCheckboxModule,
                MatInputModule,
                MatFormFieldModule,
            ],
        }).compileComponents();
        inject([OverlayContainer], (oc: OverlayContainer) => {
            overlayContainer = oc;
            overlayContainerElement = oc.getContainerElement();
          })();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        input = fixture.debugElement.query(By.css('input'))!.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
