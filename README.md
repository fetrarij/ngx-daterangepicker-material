# Angular daterangepicker

A simple Angular 2+ Date range picker with material theme. Compatible with Angular2, Angular4 and Angular5. It uses moment.js.

demo:  https://fetrarij.github.io/daterangepicker/

## Installation

1) Run `npn install ngx-daterangepicker-material --save` .
2) import **NgDaterangepickerMd** to your **@NgModule** like example below
    ````typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { App } from './app';
    import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

    @NgModule({
        imports:      [BrowserModule, NgxDaterangepickerMd],
        declarations: [App],
        bootstrap:    [App]
    })
    export class AppModule {}
    ````

3) now we can use it


## Usage
```html
<input type="text" ngDaterangepickerMd [(ngModel)]="selected" class="form-control"/>
```
````typescript
selected: {startdDate: Moment, endDate: Moment};
````
