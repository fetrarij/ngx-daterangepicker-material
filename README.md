# ngx-daterangepicker-material

> Angular 2+ Date range picker.

[![Build Status](https://travis-ci.org/fetrarij/ngx-daterangepicker-material.svg?branch=master)](https://travis-ci.org/fetrarij/ngx-daterangepicker-material)
[![npm version](https://badge.fury.io/js/ngx-daterangepicker-material.svg)](https://badge.fury.io/js/ngx-daterangepicker-material)
[![last commit](https://img.shields.io/github/last-commit/fetrarij/ngx-daterangepicker-material.svg)](https://github.com/fetrarij/ngx-daterangepicker-material/commits/master)

This `Angular Material` plugin is compatible with Angular 2+ and is Ivy compatible. It leverages `moment.js` to handle date manipulation and parsing. The base for this plugin was originally the [Bootstrap Date Range Picker](http://www.daterangepicker.com), but its dependencies on jQuery and Bootstrap were removed. `Angular Material` themes are fully supported since v3.0.0, so you can just drop this component into an existing Material project and it will blend right into your application.

![](screen.png)

Demo: https://fetrarij.github.io/ngx-daterangepicker-material/

---

## Versions

| Angular| ngx-daterangepicker-material|
| ------|:------:| 
| >=9.0.0 with @angular/material |v3.x |
| >=9.0.0 without @angular/material | v2.3.x |
| <9.0.0  | v2.2.x and below|

---

## Installation

### Using the Angular CLI

The recommended way to install `ngx-daterangepicker-material` is by leveraging the `Angular CLI`, which will take care of all the heavy lifting for you:

```
ng add ngx-daterangepicker-material
```

### Manual install

If you so choose, you can also manually install the plugin following these steps.
You'll first need to install `Angular Material` (see the [official docs](https://material.angular.io/guide/getting-started) for more information):

```
ng add @angular/material
```

Next up, install `ngx-daterangepicker-material` package using your prefered package manager:

```
npm i -D ngx-daterangepicker-material
yarn add -D ngx-daterangepicker-material
```

import **NgxDaterangepickerMd** in your module:

```typescript
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { App } from './app';

@NgModule({
    imports: [
        ... ,
        NgxDaterangepickerMd.forRoot()
    ],
    declarations: [App],
    bootstrap:    [App]
})
export class AppModule {}
```

## Usage example

The [demo](https://fetrarij.github.io/ngx-daterangepicker-material/) is the best place to see the picker in action in some different use case, along with the accompanying source code. The picker can be used in two ways, either as a `Component` or a `Directive`. Two basic snippets illustrating this can be found below:

### Directive

Adding the `ngxDaterangepickerMd` directive to an `<input>` element adds the picker as a pop-up element to that `<input>` field. The `drops` (`up` or `down`) and `opens` (`left`, `center` or `right`) inputs determine where to display the pop-up.

```html
<input matInput ngxDaterangepickerMd [formControl]="formControl" />
```

### with some options:

```html
<input
    matInput
    ngxDaterangepickerMd
    startKey="start"
    endKey="end"
    [locale]="{applyLabel: 'ok', format: 'DD-MM-YYYY'}"
    [formControl]="formControl"
/>
```

You can [play with our online demo here](https://fetrarij.github.io/ngx-daterangepicker-material/)
and [browse our demo code here](./demo/src/app).

## Component

You can use the component directly in your templates, which will set its `inline` mode to **true**, in which case the calendar won't hide after date/range selection. You can then use the events: `rangeClicked` or `datesUpdated` or `chosenDate` to get its selection state.

```html
<ngx-daterangepicker-material (chosenDate)="chosenDate($event)"> </ngx-daterangepicker-material>
```

## Available options

### autoApply, showDropdowns, singleDatePicker, showWeekNumbers, showISOWeekNumbers, alwaysShowCalendars, showClearButton, showCancel

> These options are booleans

### isCustomDate

> (function) A function that is passed each date in the calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell

### isInvalidDate

> (function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.

### isTooltipDate

> (function) A function that is passed each date in the two calendars before they are displayed, and may return a text to be displayed as a tooltip.

### minDate, maxDate

> To set the minimal and maximal date, these options are a moment date

### dateLimit

> To set max number of the date we can choose

### locale

> the locale options is an object with:

```javascript
{
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: 1 // first day is monday
}
```

[Check here](#global-locale) for setting the global locale

### startKey and endKey

Theses 2 options are for the key you want for the value, default are `startDate` and `endDate`, it means the value we have from ngModel are: `{startDate: Date, endDate: Date}` by default;

Specifiyng `startKey` and `endKey` would have different model:

example:

```html
<input type="text" ngxDaterangepickerMd startKey="start" endKey="end" [(ngModel)]="model" />
```

the model we got would be: `{start: Date, end: Date}`

### ranges

(object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. As an example:

```html
<input type="text" ngxDaterangepickerMd startKey="start" endKey="end" [ranges]="ranges" [(ngModel)]="model" />
```

```javascript
ranges: any = {
    Today: [moment().startOf('day'), moment().endOf('day')],
    Yesterday: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
};
```

#### Other options with ranges

You can use bellow options when using the ranges. The default are `false`.

| Attribut                     | Type    | Description                                                                   |
| ---------------------------- | ------- | ----------------------------------------------------------------------------- |
| alwaysShowCalendars          | boolean | set to `true` if you want to display the ranges with the calendar             |
| keepCalendarOpeningWithRange | boolean | set to `true` if you want the calendar won't be closed after choosing a range |
| showRangeLabelOnInput        | boolean | set to `true` if you want to display the range label on input                 |
| customRangeDirection         | boolean | set to `true` if you want to allow selection range from end date first        |
| lockStartDate                | boolean | set to `true` if you want to lock start date and change only the end date     |


### Timepicker

You have to set the attribute `timePicker` to `true` if you want to enable the timepicker.

You can use theses options:

| Attribut            | Type    | Description                                                                                 |
| ------------------- | ------- | ------------------------------------------------------------------------------------------- |
| timePicker24Hour    | boolean | set to `true` if you want to set the timepicker to 24h instead of having AM and PM          |
| timePickerIncrement | number  | set the value increment of the minutes (eg: for `12` there would be 0mn, 15mn, 30mn, 45mn,) |
| timePickerSeconds   | boolean | set `true` if you want do display second's select                                           |

### Customisation

| Attribut                    | Type   | Description                                                        |
| --------------------------- | ------ | ------------------------------------------------------------------ |
| firstMonthDayClass          | string | add a custom class for all first day of the month                  |
| lastMonthDayClass           | string | add a custom class for all last day of the month                   |
| emptyWeekRowClass           | string | add a custom class for all date in a week not in the current month |
| lastDayOfPreviousMonthClass | string | add a custom class for the last day of the previous month          |
| firstDayOfNextMonthClass    | string | add a custom class for the first day of the next month             |

### Positioning

| Attribut | Possible values     | Description                                             |
| -------- | ------------------- | ------------------------------------------------------- |
| opens    | left, center, right | position the calendar from the input element            |
| drops    | up, down            | position the calendar to the up or down of the calendar |

## Available events

### \(rangeClicked)

> Fired when clicked on range, and send an object with range label and dates value, eg: `{label: 'This Month', dates: [Moment, Moment]}`

### \(datesUpdated)

> Fires when the date model is updated, like applying (if you have activated the apply button), or when selecting a range or date without the apply button, and sends an object containing start and end dates, eg: `{startDate: Moment, endDate: Moment}`

### Global locale

For setting the global locale, pass this object to NgxDaterangepickerMd.forRoot().

eg:

```
@NgModule({
    imports: [
        ... ,
        FormsModule,
        NgxDaterangepickerMd.forRoot({
            separator: ' - ',
            applyLabel: 'Okay',
        })
    ],
    declarations: [App],
    bootstrap:    [App]
})
```

## Development

### Prepare your environment

Install local dependencies: `npm install`.

### Development server

Run `npm start` to start a development server on a port 4200.

Open `http//:localhost:4200` on your browser.

## Tests

Run `npm test` or `ng test` to run tests.

## [License](https://github.com/fetrarij/ngx-daterangepicker-material/blob/master/LICENSE)

MIT
