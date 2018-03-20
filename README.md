# ng-md-daterangepicker

A simple Angular 2+ Date range picker with material theme. Compatible with Angular2, Angular4 and Angular4. It uses moment.js.

## Installation

1) Run `npn install ng-daterangepicker-md --save` . 
2) import **NgMdDaterangepicker** to your **@NgModule** like example below
    ````
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { App } from './app';
    import { NgDaterangepickerMd } from 'ng-daterangepicker-md';

    @NgModule({
        imports:      [ BrowserModule, NgxDaterangepicker ],
        declarations: [ App ],
        bootstrap:    [ App ]
    })
    export class AppModule {}
    ````

3) now we can use it


## Usage
```html
<input type="text" ngMdDaterangepicker class="form-control"/>
```

