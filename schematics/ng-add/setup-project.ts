/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { addModuleImportToRootModule, getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import {Schema} from './schema';

const moduleName = 'NgxDaterangepickerMd';

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
function addDateRangePickerModule(options: any) {
    return (host: Tree) => {
        (async () => {
            const workspace = await getWorkspace(host);
            const project = getProjectFromWorkspace(workspace, options.project);

            addModuleImportToRootModule(host, moduleName + '.forRoot()', 'ngx-daterangepicker-material', project);
        })();
        return host;
    };
}
