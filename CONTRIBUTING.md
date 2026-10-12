# Contributing

Thanks for your help! Bug reports, fixes and docs improvements are all welcome.

## Report a bug

Before you open an issue, please check that the bug still happens with the latest version.

In the issue, give:

- the version of `ngx-daterangepicker-material` and of Angular;
- what you did, what you expected, and what happened;
- a small reproduction, if you can. A [StackBlitz](https://stackblitz.com) is the best.

## Set up the project

You need Node 22 or later.

```bash
npm install
npm start    # demo app on http://localhost:4200, uses the library from src/
npm test     # unit tests (karma) and ng add schematic tests
npm run build    # builds the library to dist/
```

Where the code is:

- `src/daterangepicker/`: the library. `daterangepicker.directive.ts` holds the inputs and outputs,
  `daterangepicker.component.ts` holds the calendar.
- `demo/`: the demo app.
- `schematics/ng-add/`: the `ng add` schematic.

`npm run lint` only checks `demo/`. To lint the library, run `npx eslint "src/**/*.ts"`.

## Send a pull request

- One pull request per issue.
- Add a test that fails before your fix and passes after it.
- Run `npm test` before you push.
- Write commit messages like `fix(component): short summary` (types: `fix`, `feat`, `docs`,
  `test`, `chore`).
- Add `Closes #123` in the pull request description.

If you plan a bigger change, open an issue first so we can talk about it.
