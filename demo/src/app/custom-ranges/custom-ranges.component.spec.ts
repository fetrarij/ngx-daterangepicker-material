import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from '../../../../src/daterangepicker';
import { CustomRangesComponent } from './custom-ranges.component';

describe('CustomRangesComponent', () => {
    let component: CustomRangesComponent;
    let fixture: ComponentFixture<CustomRangesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CustomRangesComponent],
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
