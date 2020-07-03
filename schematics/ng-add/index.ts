import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';



// Just return the tree
export default function(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const angularVersionRange = getPackageVersionFromPackageJson(tree, '@angular/core');
        const materialVersionRange = getPackageVersionFromPackageJson(tree, '@angular/material');
        const cdkVersionRange = getPackageVersionFromPackageJson(tree, '@angular/cdk');
        const [version, major] = angularVersionRange.split('.');
        // fallback material version
        const fallbackMaterialVersionRange = version.replace('~', '^') + '.' + major  + '.0';

        // Add @angular/material if the package isn't installed yet
        if (materialVersionRange === null) {
            addPackageToPackageJson(tree, '@angular/material', fallbackMaterialVersionRange);
        }
        // Add @angular/cdk if the package isn't installed yet
        if (cdkVersionRange === null) {
            addPackageToPackageJson(tree, '@angular/cdk', materialVersionRange || fallbackMaterialVersionRange);
        }
        // add angular/forms
        addPackageToPackageJson(tree, '@angular/forms', angularVersionRange);

        const installTaskId = _context.addTask(new NodePackageInstallTask());
        _context.addTask(new RunSchematicTask('ng-add-setup-project', _options), [installTaskId]);

        return tree;
    };
}
