/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { addRootImport, addRootProvider } from '@schematics/angular/utility';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { getMainFilePath } from '@schematics/angular/utility/standalone/util';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import {Schema} from './schema';

const packageName = 'ngx-daterangepicker-material';
const moduleName = 'NgxDaterangepickerMd';
const providerFunction = 'provideDaterangepicker';

/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built themes to styles.ext
 *  - Adds Browser Animation to app.module
 */
export default function (options: Schema): Rule {
    return chain([
        addDateRangePickerModule(options),
    ]);
}

/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addDateRangePickerModule(options: any): Rule {
    return async (host: Tree) => {
        const workspace = await getWorkspace(host);
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new Error(`Project "${options.project}" not found in workspace.`);
        }
        const mainFilePath = await getMainFilePath(host, options.project);
        if (isStandaloneApp(host, mainFilePath)) {
            return addRootProvider(options.project, ({ code, external }) => code`${external(providerFunction, packageName)}()`);
        }
        return addRootImport(options.project, ({ code, external }) => code`${external(moduleName, packageName)}.forRoot()`);
    };
}
