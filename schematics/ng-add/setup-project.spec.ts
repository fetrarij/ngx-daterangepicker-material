import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import * as path from 'node:path';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

const collectionPath = path.join(__dirname, '../collection.json');

async function createApp(runner: SchematicTestRunner, standalone: boolean): Promise<UnitTestTree> {
    const workspace = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '22.0.0',
    });
    return runner.runExternalSchematic('@schematics/angular', 'application', { name: 'app', standalone }, workspace);
}

describe('ng-add', () => {
    it('adds NgxDaterangepickerMd.forRoot() to a standalone app', async () => {
        const runner = new SchematicTestRunner('ngx-daterangepicker-material', collectionPath);
        const app = await createApp(runner, true);
        const tree = await runner.runSchematic('ng-add', { project: 'app' }, app);
        const config = tree.readText('/projects/app/src/app/app.config.ts');
        assert.match(config, /import \{ NgxDaterangepickerMd \} from 'ngx-daterangepicker-material';/);
        assert.match(config, /importProvidersFrom\(NgxDaterangepickerMd\.forRoot\(\)\)/);
    });

    it('adds NgxDaterangepickerMd.forRoot() to an NgModule app', async () => {
        const runner = new SchematicTestRunner('ngx-daterangepicker-material', collectionPath);
        const app = await createApp(runner, false);
        const tree = await runner.runSchematic('ng-add', { project: 'app' }, app);
        const appModule = tree.readText('/projects/app/src/app/app-module.ts');
        assert.match(appModule, /import \{ NgxDaterangepickerMd \} from 'ngx-daterangepicker-material';/);
        assert.match(appModule, /imports: \[[^\]]*NgxDaterangepickerMd\.forRoot\(\)/);
    });
});
