/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { chain, Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { addModuleImportToRootModule, getProjectFromWorkspace, getProjectStyleFile } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import {Schema} from './schema';
import {addThemeToAppStyles } from './theming/theming';

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
        addThemeToAppStyles(options),
        addMaterialAppStyles(options)
    ]);
}

/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addDateRangePickerModule(options: any) {
    return (host: Tree) => {
        const workspace = getWorkspace(host);
        const project = getProjectFromWorkspace(workspace, options.project);

        addModuleImportToRootModule(host, moduleName + '.forRoot()', 'ngx-daterangepicker-material', project);

        return host;
    };
}
/**
 * Adds custom Material styles to the project style file. The custom CSS sets up the Roboto font
 * and reset the default browser body margin.
 */
function addMaterialAppStyles(options: Schema) {
    return (host: Tree, context: SchematicContext) => {
      const workspace = getWorkspace(host);
      const project = getProjectFromWorkspace(workspace, options.project);
      const styleFilePath = getProjectStyleFile(project);
      const logger = context.logger;

      if (!styleFilePath) {
        logger.error(`Could not find the default style file for this project.`);
        logger.info(`Please consider manually setting up the Roboto font in your CSS.`);
        return;
      }

      const buffer = host.read(styleFilePath);

      if (!buffer) {
        logger.error(`Could not read the default style file within the project ` +
          `(${styleFilePath})`);
        logger.info(`Please consider manually setting up the Robot font.`);
        return;
      }

      const htmlContent = buffer.toString();
      const insertion = '\n' +
        `html, body { height: 100%; }\n` +
        `body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }\n`;

      if (htmlContent.includes(insertion)) {
        return;
      }

      const recorder = host.beginUpdate(styleFilePath);

      recorder.insertLeft(htmlContent.length, insertion);
      host.commitUpdate(recorder);
    };
}
