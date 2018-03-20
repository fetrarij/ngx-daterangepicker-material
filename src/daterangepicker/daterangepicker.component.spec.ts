import { TestBed, inject, async } from '@angular/core/testing';
import { DaterangepickerComponent } from './daterangepicker.component';

describe('a daterangepicker component', () => {
	let component: DaterangepickerComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DaterangepickerComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([DaterangepickerComponent], (DaterangepickerComponent) => {
		component = DaterangepickerComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});

	it('should render title in a h1 tag', async(() => {
		const fixture = TestBed.createComponent(DaterangepickerComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		compiled.querySelector('input').nativeElement.focus();
		const daterangepicker = fixture.debugElement.componentInstance;
    	expect(daterangepicker.isShown).toEqual(true);
  }));
});
