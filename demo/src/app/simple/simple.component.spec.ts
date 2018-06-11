import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule} from '@angular/material';
import { NgxDaterangepickerMd } from '../../../../src/daterangepicker';

import { By } from '@angular/platform-browser';
import { SimpleComponent } from './simple.component';

describe('SimpleComponent', () => {
  let component: SimpleComponent;
  let fixture: ComponentFixture<SimpleComponent>;
  const opener = '.form-control';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleComponent ],
      imports: [
        FormsModule,
        NgxDaterangepickerMd,
        MatToolbarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should click on input and open daterange', () => {
    fixture.whenStable().then(() => {
      component = fixture.componentInstance;
      fixture.debugElement.queryAll(By.css(opener))[0].nativeElement.click();
      fixture.detectChanges();
      expect(component.picker.isShown).toBeTruthy();
    });
  });
  it('should call change and ngModelChange on select date range', () => {
    fixture.whenStable().then(() => {
      fixture.debugElement.queryAll(By.css(opener))[0].nativeElement.click();
      let table = fixture.nativeElement.querySelectorAll('table');
      let trs = table[0].querySelectorAll('tr');
      let tds = trs[4].querySelectorAll('td');
      spyOn(component, 'change');
      spyOn(component, 'ngModelChange');
      tds[0].click();
      fixture.detectChanges();
      tds[4].click();
      fixture.detectChanges();
      fixture.debugElement.queryAll(By.css('button'))[1].nativeElement.click();
      fixture.detectChanges();
      expect(component.change).toHaveBeenCalled();
      expect(component.ngModelChange).toHaveBeenCalled();
    });
  })
});
