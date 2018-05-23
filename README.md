# Angular daterangepicker 
[![Build Status](https://travis-ci.org/fetrarij/ngx-daterangepicker-material.svg?branch=master)](https://travis-ci.org/fetrarij/ngx-daterangepicker-material)
[![npm version](https://badge.fury.io/js/ngx-daterangepicker-material.svg)](https://badge.fury.io/js/ngx-daterangepicker-material)

Pure Angular 2+ Date range picker. Compatible with Angular2, Angular4, Angular5 and Angular6. This plugin uses moment.js.

This plugin is a rewrite to angular from [bootstrap daterangepicker](http://www.daterangepicker.com), so it doesn't depends on jquery nor bootstrap.

This plugin have an independant theme which looks more close to material design, so the material design is just a style.

demo:  https://fetrarij.github.io/ngx-daterangepicker-material/

## Installation

1) Run `npm install ngx-daterangepicker-material --save` .
2) import **NgxDaterangepickerMd** to your **@NgModule** like example below
    ````typescript
    ...
    import { FormsModule } from '@angular/forms';
    import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
    import { App } from './app';

    @NgModule({
        imports:      [... , FormsModule, NgxDaterangepickerMd],
        declarations: [App],
        bootstrap:    [App]
    })
    export class AppModule {}
    ````

3) now we can use it


## Usage
```html
<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" class="form-control"/>
```
or with some options: 
```html
    <input type="text" matInput
    ngxDaterangepickerMd
    [autoApply]="false"
    [showInputs]="false"
    [singleDatePicker]="true"
    [locale]="{applyLabel: 'ok', format: 'DD-MM-YYYY'}"
    startKey="start"
    endKey="end"
    [(ngModel)]="selected"
    name="daterange"/>
```

````typescript
selected: {startdDate: Moment, endDate: Moment};
````


## Options

### autoApply, showInputs, showInputs, singleDatePicker, showWeekNumbers, showISOWeekNumbers

These options are booleans

### minDate, maxDate

 To set the minimal and maximal date, these options are a moment date

### locale

the locale options is an object with: 
```javascript
{
    format: 'MM/DD/YYYY',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay' // detault is 'Apply'
}
```
### startKey and endKey

Theses 2 options are for the key you want for the value, default are `startDate` and `endDate`, it means the value we have from ngModel are: `{startDate: Date, endDate: Date}` by default;

Specifiyng `startKey` and `endKey` would have different model:

example: 
```html
<input type="text" ngxDaterangepickerMd startKey="start" endKey="end" [(ngModel)]="model">
```

the model we got would be:  `{start: Date, end: Date}`

## [License](https://github.com/fetrarij/ngx-daterangepicker-material/blob/master/LICENSE)