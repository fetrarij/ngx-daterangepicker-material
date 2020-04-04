import { Component, Input } from '@angular/core';

@Component({
    selector: 'example',
    template: `
        <div>
            <mat-toolbar color="primary">{{ title }}</mat-toolbar>

            <div class="content">
                <ng-content></ng-content>

                <pre>
                    <code [highlight]="code"></code>
                </pre>
            </div>
        </div>
    `,
    styleUrls: ['./example.component.less'],
})
export class ExampleComponent {
    @Input()
    title: string;

    @Input()
    code: string;
}
