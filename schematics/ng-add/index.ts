import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';

// Just return the tree
export function ngAdd(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const angularVersionRange = getPackageVersionFromPackageJson(tree, '@angular/core');
        const materialVersionRange = getPackageVersionFromPackageJson(tree, '@angular/material');
        const cdkVersionRange = getPackageVersionFromPackageJson(tree, '@angular/cdk');

        // Add @angular/material if the package isn't installed yet
        if (materialVersionRange === null) {
            addPackageToPackageJson(tree, '@angular/material', angularVersionRange);
        }

        // Add @angular/cdk if the package isn't installed yet
        if (cdkVersionRange === null) {
            addPackageToPackageJson(tree, '@angular/cdk', angularVersionRange);
        }

        const installTaskId = _context.addTask(new NodePackageInstallTask());
        _context.addTask(new RunSchematicTask('ng-add-setup-project', _options), [installTaskId]);

        return tree;
    };
}
