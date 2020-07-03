import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from '../../../../src/daterangepicker';
import { CustomRangesComponent } from './custom-ranges.component';
import { CustomRangesExampleComponent } from '../examples/custom-ranges-example.component';
import { CustomRangesInlineExampleComponent } from '../examples/custom-ranges-inline-example.component';
import { ExampleComponent } from '../example/example.component';
import {Overlay, OverlayContainer} from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';

describe('CustomRangesComponent', () => {
    let component: CustomRangesComponent;
    let fixture: ComponentFixture<CustomRangesComponent>;
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
                CustomRangesComponent,
                CustomRangesExampleComponent,
                CustomRangesInlineExampleComponent,
                ExampleComponent
            ],
            imports: [
                ReactiveFormsModule,
                NgxDaterangepickerMd.forRoot(),
                NoopAnimationsModule,
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
        fixture = TestBed.createComponent(CustomRangesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        input = fixture.debugElement.query(By.css('input'))!.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
