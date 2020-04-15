import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDaterangepickerMd } from '../../../../src/daterangepicker';
import { SimpleComponent } from './simple.component';

describe('SimpleComponent', () => {
    let component: SimpleComponent;
    let fixture: ComponentFixture<SimpleComponent>;
    const opener = '.form-control';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SimpleComponent],
            imports: [
                FormsModule,
                NgxDaterangepickerMd.forRoot(),
                NoopAnimationsModule,
                MatToolbarModule,
                MatInputModule,
                MatFormFieldModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SimpleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call chosenDate() when a valid date range was selected', fakeAsync(() => {
        spyOn(component, 'chosenDate');
        fixture.debugElement.queryAll(By.css(opener))[0].nativeElement.click();
        tick(200);

        let table = fixture.nativeElement.querySelectorAll('table');
        let trs = table[0].querySelectorAll('tr');
        let tds = trs[4].querySelectorAll('td');

        tds[0].click();
        tds[4].click();
        fixture.nativeElement.querySelector('ngx-daterangepicker-material button[color="primary"]').click();

        expect(component.chosenDate).toHaveBeenCalled();
    }));
});
