# ngx-daterangepicker-material

> Date range picker for Angular, with predefined ranges and a time picker.

[![Build Status](https://github.com/fetrarij/ngx-daterangepicker-material/actions/workflows/actions.yml/badge.svg)](https://github.com/fetrarij/ngx-daterangepicker-material/actions)
[![npm version](https://badge.fury.io/js/ngx-daterangepicker-material.svg)](https://badge.fury.io/js/ngx-daterangepicker-material)
[![npm downloads](https://img.shields.io/npm/dm/ngx-daterangepicker-material.svg)](https://www.npmjs.com/package/ngx-daterangepicker-material)
[![license](https://img.shields.io/npm/l/ngx-daterangepicker-material.svg)](https://github.com/fetrarij/ngx-daterangepicker-material/blob/master/LICENSE)
[![last commit](https://img.shields.io/github/last-commit/fetrarij/ngx-daterangepicker-material.svg)](https://github.com/fetrarij/ngx-daterangepicker-material/commits/master)

A date range picker with a Material look. It works with Angular 22, standalone components, SSR and zoneless apps. It uses `dayjs` to handle dates. It started as a port of the [Bootstrap Date Range Picker](http://www.daterangepicker.com), without its jQuery, Bootstrap and moment.js dependencies.

Actively maintained again since 2026. New issues get a reply.

![Demo: picking a predefined range, then a custom range](screen.gif)

Demo: https://fetrarij.github.io/ngx-daterangepicker-material/

## Why this library

Compared to the Angular Material date range picker, it gives you:

- predefined ranges (Today, Last 7 days, This month...), or your own;
- an optional time picker;
- one input where users can type or pick the whole range.

---

## Versions

| Angular| ngx-daterangepicker-material|
| ------|:------:|
| 22.x.x  | v22.x.x |
| 21.x.x  | v21.x.x |
| 20.x.x  | v20.x.x |
| 19.x.x  | v19.x.x |
| 17.x.x  | v17.x.x |
| 16.x.x  | v16.x.x |
| 12.0.0 - 15.x.x  | v6.x.x |
| <=11.0.0  | v5.x.x |
| >=9.0.0  | v4.x.x |
| <9.0.0  | v2.x.x |
| ~~>=9.0.0 depends on @angular/material~~ |~~v3.x~~ |

Since v16, the package's major version tracks the Angular major version it supports

---

## Installation

### With ng add

```bash
ng add ngx-daterangepicker-material
```

It installs the package and registers `NgxDaterangepickerMd.forRoot()` for you: in
`app.config.ts` for a standalone app, or in your root `NgModule`. Available since v22.1.3.

Then import `NgxDaterangepickerMd` and `FormsModule` in the component that uses the picker
(see the component example below).

### Manual setup

Install the package from npm:

```bash
npm install ngx-daterangepicker-material
```

#### Standalone apps

`NgxDaterangepickerMd` is still an `NgModule` internally, but it works with standalone
applications too. Register `NgxDaterangepickerMd.forRoot()`'s providers once with
`importProvidersFrom` in your app config:

````typescript
// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NgxDaterangepickerMd.forRoot())
  ]
};
````

Then import `NgxDaterangepickerMd` directly in any standalone component that uses the
directive:

````typescript
// app.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './app.html'
})
export class App {
  selected: { startDate: unknown; endDate: unknown } | null = null;
}
````

`forRoot()` must only be called once, from `app.config.ts` — do not add it again to a
component's own `imports` array.

#### NgModule apps

Import **NgxDaterangepickerMd** in your module:

````typescript
...
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { App } from './app';

@NgModule({
    imports: [
        ... ,
        FormsModule,
        NgxDaterangepickerMd.forRoot()
    ],
    declarations: [App],
    bootstrap:    [App]
})
export class AppModule {}
````

### Older apps: TS1259 error

`dayjs` needs `esModuleInterop` (or `allowSyntheticDefaultImports`). Apps created with
Angular CLI 20 or later already have it (through `"module": "preserve"`), so there is nothing
to do. In an older app, if the build fails with `TS1259`, add this to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

### Testing with Jest

The library imports `dayjs/esm`, which Jest can't load as is (`SyntaxError: Cannot use import statement outside a module`). Point Jest to the CommonJS build of dayjs in your `jest.config.js`:

```js
moduleNameMapper: {
  '^dayjs/esm$': 'dayjs',
  '^dayjs/esm/(.*)$': 'dayjs/$1'
}
```

Keep `esModuleInterop: true` in the tsconfig used by your tests. Alternatively, let Jest transform dayjs: `transformIgnorePatterns: ['node_modules/(?!(dayjs|.*\\.mjs$))']`.

## Usage example

Html:

```html
<input type="text" ngxDaterangepickerMd [(ngModel)]="selected" class="form-control"/>
```
Typescript:

````typescript
selected: {startDate: Dayjs, endDate: Dayjs};
````

The user can also type the dates in the input and press Enter to apply them. Closing the picker without Apply (click outside, Escape or Cancel) keeps the last applied value.

With `singleDatePicker`, the value can also be a single date (dayjs date, native `Date` or ISO string). The picker still sends `{startDate, endDate}` back.
### with some options:
Html:

```html
<input type="text" matInput
    ngxDaterangepickerMd
    [locale]="{applyLabel: 'ok', format: 'DD-MM-YYYY'}"
    startKey="start"
    endKey="end"
    [(ngModel)]="selected"
    name="daterange"/>
```
Typescript:

````typescript
selected: {start: Dayjs, end: Dayjs};
````
You can [play with our online demo here](https://fetrarij.github.io/ngx-daterangepicker-material/)
and [browse our demo code here](./demo/src/app).

## Inline usage

You can use the component directly in your templates, which will set its `inline` mode to **true**, in which case the calendar won't hide after date/range selection. You can then use the events: `rangeClicked` or `datesUpdated` or `choosedDate` to get its selection state.

```html
<ngx-daterangepicker-material (choosedDate)="choosedDate($event)">
</ngx-daterangepicker-material>
```


## Available options

### autoApply, showDropdowns, singleDatePicker, showWeekNumbers, showISOWeekNumbers, alwaysShowCalendars, showClearButton, showCancel

>These options are booleans

### isCustomDate

>(function) A function that is passed each date in the calendars before they are displayed, and may return a string or array of CSS class names to apply to that date's calendar cell

### isInvalidDate
>(function) A function that is passed each date in the two calendars before they are displayed, and may return true or false to indicate whether that date should be available for selection or not.

Both functions get a local dayjs date. The time of that date is not always midnight, so compare by day: `date.isSame(other, 'day')`.

### isTooltipDate
>(function) A function that is passed each date in the two calendars before they are displayed, and may return a text to be displayed as a tooltip.

### minDate, maxDate

 >To set the minimal and maximal date, these options are a dayjs date, a native `Date`, or a string in [ISO](https://www.w3.org/QA/Tips/iso-date) format

Dayjs dates can come from `import dayjs from 'dayjs'` or from `'dayjs/esm'`, both work (this also applies to `ranges`, `startDate` and `endDate`). An unknown value is ignored, with a warning in the console in dev mode.

With `showDropdowns`, the year list goes from the year of `minDate` to the year of `maxDate`. Without them, it goes from 50 years ago to 5 years ahead.

### dateLimit

 >To set max number of the date we can choose

### initialDates

 >To set the months shown in the left and right calendars when the picker opens with no selected date. It's an array of two dates (dayjs dates or strings in [ISO](https://www.w3.org/QA/Tips/iso-date) format), it doesn't select any date.

For example, to open on the previous and current month instead of the current and next month:
```html
<input type="text" ngxDaterangepickerMd [initialDates]="[previousMonth, currentMonth]" [(ngModel)]="selected" />
```
```typescript
previousMonth = dayjs().subtract(1, 'month');
currentMonth = dayjs();
```

### locale

>the locale options is an object with:
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
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: 1 // first day is monday
}
```

To use a language, pass a dayjs locale as `locale`. It gives the day and month names, the first day of the week, and the language of the dates shown in the input:

```typescript
import fr from 'dayjs/esm/locale/fr';

frLocale = { locale: fr, format: 'D MMMM YYYY', applyLabel: 'Appliquer' };
```

```html
<input ngxDaterangepickerMd [locale]="frLocale" [(ngModel)]="selected" />
```

The `[locale]` input can be changed at runtime, for example when the user switches language.

Dates typed in the input are read with `format` and the month names of this locale, like `5 enero 2026 - 10 enero 2026` in Spanish.

#### Global locale

To set the locale for every picker of the app, pass it to `NgxDaterangepickerMd.forRoot()`. In a standalone app:

```typescript
// app.config.ts
providers: [
  importProvidersFrom(NgxDaterangepickerMd.forRoot({
    separator: ' - ',
    applyLabel: 'Okay',
  }))
]
```

In an NgModule app:

```typescript
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

### startKey and endKey

Theses 2 options are for the key you want for the value, default are `startDate` and `endDate`, it means the value we have from ngModel are: `{startDate: Date, endDate: Date}` by default;

Specifiyng `startKey` and `endKey` would have different model:

example:
```html
<input type="text" ngxDaterangepickerMd startKey="start" endKey="end" [(ngModel)]="model">
```

the model we got would be:  `{start: Date, end: Date}`

### Required validation

Use `dateRangeRequired()` instead of `Validators.required`: after "Clear", the value is `{ startDate: null, endDate: null }`, which `Validators.required` treats as filled.

```typescript
import { dateRangeRequired } from 'ngx-daterangepicker-material';

dates = new FormControl(null, dateRangeRequired());
```

With custom keys, pass them in the same order: `dateRangeRequired('start', 'end')`.

### ranges

(object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range. As an example:
```html
<input type="text" ngxDaterangepickerMd startKey="start" endKey="end" [ranges]="ranges" [(ngModel)]="model">
```
```javascript
ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
```
#### Other options with ranges

You can use bellow options when using the ranges. The default are `false`.

| Attribut | Type |Description |
| --- | --- |--- |
| alwaysShowCalendars | boolean | set to `true` if you want to display the ranges with the calendar |
| keepCalendarOpeningWithRange | boolean | set to `true` if you want the calendar won't be closed after choosing a range |
| showRangeLabelOnInput | boolean | set to `true` if you want to display the range label on input |
| customRangeDirection | boolean | set to `true` if you want to allow selection range from end date first |
| lockStartDate | boolean | set to `true` if you want to lock start date and change only the end date |

#### Open datepicker from outside

It is possible to open datepicker from outside. You should create an input with attached datepicker directive and a button with "ngx-daterangepicker-action" class (to prevent triggering of clickOutside). Clicks on its content (an icon, a `mat-icon`, an `svg`) count too.
```html
    <input
      ngxDaterangepickerMd
      [closeOnAutoApply]="true"
      [autoApply]="true"
      [singleDatePicker]="true"
      [linkedCalendars]="true"
      [(ngModel)]="selected"
      (datesUpdated)="datesUpdated($event)"
      class="datepicker-calendar-icon">

    <a class="ngx-daterangepicker-action" (click)="openDatepicker()">
      Open
    </a>
```

```javascript

  ...
    @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
  ...
  ...
  openDatepicker() {
    this.pickerDirective.open();
  }
```

### Timepicker

You have to set the attribute `timePicker` to `true` if you want to enable the timepicker.

You can use theses options:

| Attribut | Type |Description |
| --- | --- |--- |
| timePicker24Hour | boolean | set to `true` if you want to set the timepicker to 24h instead of having AM and PM |
| timePickerIncrement | number | set the value increment of the minutes (eg: for `12` there would be 0mn, 15mn, 30mn, 45mn,) |
| timePickerSeconds | boolean | set `true` if you want do display second's select |


### Customisation

| Attribut | Type |Description |
| --- | --- |--- |
| firstMonthDayClass | string | add a custom class for all first day of the month |
| lastMonthDayClass | string | add a custom class for all last day of the month |
| emptyWeekRowClass | string | add a custom class in a row with a date in a week not in the current month |
| emptyWeekColumnClass | string | add a custom class for all date in a week not in the current month |
| lastDayOfPreviousMonthClass | string | add a custom class for the last day of the previous month |
| firstDayOfNextMonthClass | string | add a custom class for the first day of the next month |

### Positioning

| Attribut | Possible values |Description |
| --- | --- |--- |
| opens | left, center, right | position the calendar from the input element |
| drops | up, down | position the calendar to the up or down of the calendar |
| appendToBody | boolean, default `false` | move the calendar to `<body>`, so a parent with `overflow: hidden` can't cut it (since 22.2.0) |

When it opens, the calendar is kept inside the window. With `appendToBody`, it also follows the input when the page or a parent scrolls.

Inside a `mat-form-field`, the calendar can be cut by the field. Use `appendToBody`:

```html
<mat-form-field>
  <input matInput ngxDaterangepickerMd [appendToBody]="true" [(ngModel)]="selected" />
</mat-form-field>
```

With `appendToBody`, your CSS rules on `.md-drppicker` must not depend on a parent of the input. It does not work when the input is inside a shadow root.

### Disable the picker

Use `[disabled]` on the input, with or without a form. With reactive forms, use `control.disable()`. A disabled input does not open the calendar.

### Typed text

Text typed or pasted in the input updates the calendar when it is a valid date. Press Enter to apply it. A script can do the same:

```typescript
input.value = '03/10/2026 - 03/12/2026';
input.dispatchEvent(new Event('input'));
input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
```

## Available events

### \(rangeClicked)

 >Fired when clicked on range, and send an object with range label and dates value, eg:  `{label: 'This Month', dates: [Dayjs, Dayjs]}`

### \(datesUpdated)

 >Fires when the date model is updated, like applying (if you have activated the apply button), or when selecting a range or date without the apply button, and sends an object containing start and end dates, eg: `{startDate: Dayjs, endDate: Dayjs}`

### \(clearClicked)

 >Fired when clicked on the clear button

### \(cancelClicked)

 >Fired when clicked on the cancel button (since 22.2.0)

### \(customRangeClicked)

 >Fired when clicked on "Custom range". It sends nothing: the dates come later with `(datesUpdated)` (since 22.2.0)

### \(change)

 >Fires when a date or range is chosen, and sends the dates, eg: `{startDate: Dayjs, endDate: Dayjs}`. It has the same name as the native `change` event of the input, so after typing in the input, your handler also gets that DOM `Event`. To get only the dates, use `(datesUpdated)` or `(ngModelChange)`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
