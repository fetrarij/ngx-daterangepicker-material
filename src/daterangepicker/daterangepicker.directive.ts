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
  KeyValueDiffers,
  Output,
  EventEmitter
} from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
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
  public picker: DaterangepickerComponent;
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
    this.picker = (<DaterangepickerComponent>componentRef.instance);
    this.picker.choosedDate.asObservable().subscribe((change: any) => {
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
  showCustomRangeLabel: boolean;
  @Input()
  linkedCalendars: boolean;
  @Input()
  singleDatePicker: boolean;
  @Input()
  showWeekNumbers: boolean;
  @Input()
  showISOWeekNumbers: boolean;
  @Input()
  ranges: any;
  _locale: any = {};
  @Input() set locale(value) {
    if (value !== null) {
      this._locale = value;
    }
  }
  get locale(): any {
    return this._locale;
  }
  @Input()
  private _endKey: string = 'endDate';
  private _startKey: string = 'startDate';
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
  @Output('change') onChange: EventEmitter<Object> = new EventEmitter(); 
  ngOnInit() {
    this.picker.choosedDate.asObservable().subscribe((change: any) => {
      if (change) {
        const value = {};
        value[this._startKey] = change.startDate;
        value[this._endKey] = change.endDate;
        this.value = value;
        this.onChange.emit(value);
      }
    });
    this.localeDiffer = this.differs.find(this.locale).create();
  }

  ngOnChanges(changes: SimpleChanges): void  {
    for (let change in changes) {
      if (changes.hasOwnProperty(change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this.picker[change] = changes[change].currentValue;
        }
      }
    }
  }
  
  ngDoCheck() {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this.picker.updateLocale(this.locale);
      }
    }
  }

  onBlur() {
    this._onTouched();
  }

  onFocus(event: any) {
    this.picker.show(event);
  }

  hide() {
    this.picker.hide();
  }

  writeValue(value) {
    this.value = value;
    this.setValue(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  private setValue(val: any) {
    if (val) {
      if (val[this._startKey]) {
        this.picker.setStartDate(val[this._startKey])
      }
      if (val[this._endKey]) {
        this.picker.setEndDate(val[this._endKey])
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
