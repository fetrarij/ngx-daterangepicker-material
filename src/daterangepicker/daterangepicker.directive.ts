import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  forwardRef,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DaterangeValue } from './daterange-value.class';

@Directive({
  selector: 'input[ngxDaterangepickerMd]',
  host: {
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective), multi: true
    }
]
})
export class DaterangepickerDirective implements OnInit, OnChanges {
  private _picker: DaterangepickerComponent;
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value: any;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _el: ElementRef
  ) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DaterangepickerComponent);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this._picker = (<DaterangepickerComponent>componentRef.instance);
    this._picker.choosedDate.asObservable().subscribe((change: any) => {
      this._el.nativeElement.value = change.chosenLabel;
    })
  }
  @Input()
  autoApply: boolean;
  get value() {
    return this._value || null;
  }

  set value(val) {
    this._value = val;
    this._onChange(val);
    this._changeDetectorRef.markForCheck();
  }
  ngOnInit() {
    this._picker.choosedDate.asObservable().subscribe((change: any) => {
      this.value = new DaterangeValue(change.startDate, change.endDate);
    });
  }

  ngOnChanges(changes: SimpleChanges): void  {
    // #TODO watch options for change
    console.log('CHANGES', changes)
  }

  onBlur() {
    this._onTouched();
  }

  onFocus(event: any) {
    this._picker.show(event);
  }

  hide() {
    this._picker.hide();
  }

  writeValue(value) {
    this.value = value;
    this.setValue(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched() {
  }
  private setValue(val: any) {
    if (val) {
      if (val.startDate) {
        this._picker.setStartDate(val.startDate)
      }
      if (val.endDate) {
        this._picker.setEndDate(val.endDate)
      }
    } else {
      //
    }
  }  
  /**
   * For click outside of the calendar's container
   * @param event event object
   */
  @HostListener('document:click', ['$event'])
  outsideClick(event) {
      if(this.isDescendant(this._el.nativeElement, event.target) === false) {
         // this.hide();
      } 
  }
  /**
   * check if child is descendant of parent
   * @param parent elementRef
   * @param child elementRef
   */
  isDescendant(parent, child) {
      let node = child;
      while (node !== null) {
        if (node === parent) {
          return true;
        } else {
          node = node.parentNode;
        }
      }
      return false;
  }
}
