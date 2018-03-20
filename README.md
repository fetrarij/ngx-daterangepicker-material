# ng-md-daterangepicker

A simple Angular 2+ Date range picker with material theme. Compatible with Angular2, Angular4 and Angular4. It doesn't require a jquery but depends on moment.js.

## Installation

1) Run `npn install ng-md-daterangepicker --save` . 
2) import **NgMdDaterangepicker** to your **@NgModule** like example below
    ````
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { App } from './app';
    import { NgMdDaterangepicker } from 'ng-md-daterangepicker';

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

