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
  Input,
  DoCheck,
  KeyValueDiffer,
  KeyValueDiffers
} from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';import { LocationChangeListener } from '@angular/common';
 const moment = _moment;

@Directive({
  selector: 'input[ngxDaterangepickerMd]',
  host: {
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
    '(click)': 'onFocus()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective), multi: true
    }
]
})
export class DaterangepickerDirective implements OnInit, OnChanges, DoCheck {
  private _picker: DaterangepickerComponent;
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value: any;
  private localeDiffer: KeyValueDiffer<string, any>;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public _changeDetectorRef: ChangeDetectorRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _el: ElementRef,
    private differs: KeyValueDiffers
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
  minDate: _moment.Moment
  @Input()
  maxDate: _moment.Moment
  @Input()
  autoApply: boolean;
  @Input()
  showInputs: boolean;
  @Input()
  alwaysShowCalendars: boolean;
  @Input()
  locale: any;
  @Input()
  private _endKey: string;
  private _startKey: string;
  @Input() set startKey(value) {
    if (value !== null) {
      this._startKey = value;
    } else {
      this._startKey = 'startDate';
    }
  };
  @Input() set endKey(value) {
    if (value !== null) {
      this._endKey = value;
    } else {
      this._endKey = 'endDate';
    }
  };
  
  notForChangesProperty: Array<string> = [
    'locale',
    'endKey',
    'startKey'
  ];
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
      this.value = {};
      this.value[this._startKey] = change.startDate;
      this.value[this._endKey] = change.endDate;
    });
    if (this.locale) {
      this.localeDiffer = this.differs.find(this.locale).create();
    }
  }

  ngOnChanges(changes: SimpleChanges): void  {
    for (let change in changes) {
      if (changes.hasOwnProperty(change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this._picker[change] = changes[change].currentValue;
        }
      }
    }
  }
  ngDoCheck() {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this._picker.updateLocale(this.locale);
      }
    }
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
      if (val[this._startKey]) {
        this._picker.setStartDate(val[this._startKey])
      }
      if (val[this._endKey]) {
        this._picker.setEndDate(val[this._endKey])
      }
    } else {
      //
    }
  }  
  /**
   * For click outside of the calendar's container
   * @param event event object
   * @param targetElement target element object
   */
  @HostListener('document:click', ['$event', '$event.target'])
  outsideClick(event, targetElement: HTMLElement): void {
      if (!targetElement) {
        return;
      }
      const clickedInside = this._el.nativeElement.contains(targetElement);
      if (!clickedInside) { 
         this.hide()
      }
  }
}
