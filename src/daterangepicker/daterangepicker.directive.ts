import { Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';

@Directive({
  selector: 'input[ngDaterangepickerMd]',
  host: {
    '(change)': 'onChange($event)',
    '(keyup.esc)': 'hide()',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()'
  }
})
export class DaterangepickerDirective {
  private _picker: DaterangepickerComponent;
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value: Date;

  constructor(
    public viewContainerRef: ViewContainerRef, 
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
  onChange(event: any) {
    console.log('change', event);
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
