import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoExampleComponent } from './demo-example.component';
import { EXAMPLE_SOURCES } from '../example-sources';

@Component({
  imports: [DemoExampleComponent],
  template: `<demo-example name="sample" title="Sample" description="A short text.">
    <p class="live">live demo</p>
  </demo-example>`
})
class HostComponent {}

describe('DemoExampleComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: EXAMPLE_SOURCES,
          useValue: {
            sample: [
              { name: 'sample.component.html', language: 'html', code: '<input ngxDaterangepickerMd />' },
              { name: 'sample.component.ts', language: 'typescript', code: 'export class Sample {}' }
            ]
          }
        }
      ]
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('shows the title, the text and the live demo', () => {
    expect(root.querySelector('h2').textContent).toBe('Sample');
    expect(root.querySelector('.description').textContent).toBe('A short text.');
    expect(root.querySelector('.preview .live')).not.toBeNull();
  });

  it('shows a tab per file, with the highlighted code', () => {
    const tabs = Array.from(root.querySelectorAll('.mat-mdc-tab')).map((tab) => tab.textContent.trim());
    const code = root.querySelector('pre code');

    expect(tabs).toEqual(['HTML', 'TS']);
    expect(code.textContent).toBe('<input ngxDaterangepickerMd />');
    expect(code.querySelector('.hljs-tag')).not.toBeNull();
  });

  it('copies the code of the file', async () => {
    const writeText = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const copy: HTMLButtonElement = root.querySelector('.copy');

    copy.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('<input ngxDaterangepickerMd />');
    expect(copy.textContent.trim()).toBe('Copied');
  });

  it('copies the file of the open tab', async () => {
    const writeText = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    root.querySelectorAll<HTMLElement>('.mat-mdc-tab')[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(root.querySelector('.file-name').textContent).toBe('sample.component.ts');

    root.querySelector<HTMLButtonElement>('.copy').click();

    expect(writeText).toHaveBeenCalledWith('export class Sample {}');
  });

  it('links its title to the example on the same page', () => {
    const anchor: HTMLAnchorElement = root.querySelector('.anchor');

    expect(root.querySelector('section').id).toBe('sample');
    expect(anchor.getAttribute('href')).toBe(`${location.pathname}#sample`);
  });

  it('shows no code without sources, like in other unit tests', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const bare = TestBed.createComponent(HostComponent);
    bare.detectChanges();

    expect(bare.nativeElement.querySelector('.code')).toBeNull();
    expect(bare.nativeElement.querySelector('.preview .live')).not.toBeNull();
  });
});
