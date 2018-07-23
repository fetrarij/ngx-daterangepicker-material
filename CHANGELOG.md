#### 1.1.4 (2018-07-11)

##### New Features

* **ranges:**
  *  set active class to default date in range ([6fc70f02](https://github.com/fetrarij/ngx-daterangepicker-material/commit/6fc70f025906bf6babbc5812a8e105b32686c13c))
  *  add event on click to range so we can get the label and the dates of the clicked range ([72d43b61](https://github.com/fetrarij/ngx-daterangepicker-material/commit/72d43b6179771c7521d6c2bb690584711a072ce3))
      ### new available event:  **\(rangeClicked)**

        >Fired when clicked on range, and send an object with range label and dates value, eg:  `{label: 'This Month', dates: [Moment, Moment]}`


##### Bug Fixes

* **range:**  wrong var: showCalInRanges not isShown ([8a6d31c3](https://github.com/fetrarij/ngx-daterangepicker-material/commit/8a6d31c3d444460c8a813dea5587204457397d5c))

#### 1.1.3 (2018-07-10)

##### New Features

* **ranges:** disabling a range if it's beyond minDate or maxDate 

#### 1.1.2 (2018-06-22)

##### Bug Fixes

* **ranges:**  Applied range does not have 'active' class - Fix #17 ([1c0f03d4](https://github.com/fetrarij/ngx-daterangepicker-material/commit/1c0f03d4bb9e4b66780ee26d635c98249d1ca73d))
* **autoApply:**  autoApply showing Cancel & Apply buttons - Fix #16 ([53288f50](https://github.com/fetrarij/ngx-daterangepicker-material/commit/53288f506bbfa276bf8840b34403ed6b17f1eedb))
* **readme:**  remove showInputs ([672ec99a](https://github.com/fetrarij/ngx-daterangepicker-material/commit/672ec99a106097c59e72923c2c480f9ba92be1c1))

#### 1.1.1 (2018-06-12)

##### Chores

* **test:**  fix tests ([b83fddfc](https://github.com/fetrarij/ngx-daterangepicker-material/commit/b83fddfca4b31a2d833712358ab895920f69dde1))

##### New Features

* **#3:**  show 2nd calendar as per maxDate if provided - As, we have provided maxDate, there is no use of showing next month as 2nd calendar as those dates will not be selectable - instead, can it be maxDate's month as second calendar and prev month as first calendar - Fix #3 ([daf00119](https://github.com/fetrarij/ngx-daterangepicker-material/commit/daf00119cc6865cb7f3ad7d00307d0cf47b673c0))
* **customisation:**   ability to add custom classes and custom invalid dates function - isCustomDate - isInvalidDate - Close #12 ([145bbf5c](https://github.com/fetrarij/ngx-daterangepicker-material/commit/145bbf5c3401c00545608e9e8286fa58e45e51c4))

##### Bug Fixes

* **clear-date:**  bug fixes - doesn't clear the date when clearing - add options to show/hide the clear button ([022c0d00](https://github.com/fetrarij/ngx-daterangepicker-material/commit/022c0d00e7e54cecaeba5635a2388b5fc746b3ff))
* **input-element:**  label is not updated after applying ([6247be2f](https://github.com/fetrarij/ngx-daterangepicker-material/commit/6247be2f2bfcaaca84240a2c673bd02c617794dc))

#### 1.1.0 (2018-06-11)

##### Chores

* **test:**  fix tests ([b83fddfc](https://github.com/fetrarij/ngx-daterangepicker-material/commit/b83fddfca4b31a2d833712358ab895920f69dde1))
* **demo:**  style & doc ([03e9ee48](https://github.com/fetrarij/ngx-daterangepicker-material/commit/03e9ee48f4299d240f46b35b5ce58863af8c3b63))

##### Documentation Changes

* **readme:**  remove showInputs & add showDropdowns ([3dadd3bf](https://github.com/fetrarij/ngx-daterangepicker-material/commit/3dadd3bfc562277ae4e0c87c35c2c5c56b953064))

##### New Features

* **calendar:**  remove showInputs & add showDropdowns ([e3edd35f](https://github.com/fetrarij/ngx-daterangepicker-material/commit/e3edd35ff8b38c82ba6fc54578d83f8f5bd02b80))
* **clear-event:**  add ability to clear dates ([ac06e825](https://github.com/fetrarij/ngx-daterangepicker-material/commit/ac06e8250f6f237f88c9ed60702755b16555be93))
* **firstDay:**  ability to change week starting calendar with locale.firstDay ([bf5ba843](https://github.com/fetrarij/ngx-daterangepicker-material/commit/bf5ba8433a3f6d7058bc0a0532c4d3157c963398))

##### Bug Fixes

* **input:**  update input element for model initialized ([95405fc6](https://github.com/fetrarij/ngx-daterangepicker-material/commit/95405fc6e9ac0d228c96ac30ccbb4cbfe9e86a63))
* **change-event:**  change & ngModelChange events - fix ngModelChange - change event not trigerred - add some tests - Fix #10 ([caf56351](https://github.com/fetrarij/ngx-daterangepicker-material/commit/caf56351b6ab6fc6dede1f9ce9232c6ef2434a01))
* **render:**  'double' class when double calendar only ([c8bfd024](https://github.com/fetrarij/ngx-daterangepicker-material/commit/c8bfd024b5941b19ecf70cc62b86bea264bdcd16))

##### Code Style Changes

* **select:**  styling the select on showDropdowns ([727f47f3](https://github.com/fetrarij/ngx-daterangepicker-material/commit/727f47f3bdd7493bfaf6b9713458a66bb6ae554e))

#### 1.0.6 (2018-06-03)

##### Bug Fixes

* **render:**  'double' class when double calendar only ([c8bfd024](https://github.com/fetrarij/ngx-daterangepicker-material/commit/c8bfd024b5941b19ecf70cc62b86bea264bdcd16))

* **calendar:**  Fix issue #6


#### 1.0.5 (2018-05-29)

##### Chores

* **doc:**  update readme ([196df1e3](https://github.com/fetrarij/ngx-daterangepicker-material/commit/196df1e320a683a56ab50f48fc46b5cfdf1e5e9e))
* **demo:**  add custom ranges demo ([bec21cb6](https://github.com/fetrarij/ngx-daterangepicker-material/commit/bec21cb6577c7a56444362a15c4c9692f27384ce))

##### New Features

* **daterangepicker:**  add custom ranges ([67771664](https://github.com/fetrarij/ngx-daterangepicker-material/commit/6777166491603bdd86070d11bde573a355276d4b))

##### Code Style Changes

* **calendar:**  update style ([4ebd3537](https://github.com/fetrarij/ngx-daterangepicker-material/commit/4ebd353799bf8f2c9a223709e87598555a51d240))

#### 1.0.4 (2018-05-28)

##### Chores

* **demo:**  update demo ([674c21fa](https://github.com/fetrarij/ngx-daterangepicker-material/commit/674c21fa2c3bdbe4212e8ca7af7e509c9ac5e610))
* **build:**  update ng-packagr ([6e57c527](https://github.com/fetrarij/ngx-daterangepicker-material/commit/6e57c527d898b226109256a7f87191918e2f45b3))

##### Bug Fixes

* **calendar:**  - fix prev & next on linked datepicker - fix single datepicker rendering ([a46ded8a](https://github.com/fetrarij/ngx-daterangepicker-material/commit/a46ded8a4a8fd7654026cbc21faa2239bf47123f))

##### Other Changes

* **readme:**  update ([7be12e30](https://github.com/fetrarij/ngx-daterangepicker-material/commit/7be12e30ff5e3c1a2c1f2759b639fc853831ed87))
*  open dp ([8516f4e8](https://github.com/fetrarij/ngx-daterangepicker-material/commit/8516f4e89d6b529c8d4e70de8418489e9c2c6062))

