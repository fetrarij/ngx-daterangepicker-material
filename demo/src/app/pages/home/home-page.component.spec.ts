import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { routes } from '../../app.routes';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let root: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter(routes), ...NgxDaterangepickerMd.forRoot().providers]
    });
    fixture = TestBed.createComponent(HomePageComponent);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows an inline calendar with the predefined ranges', () => {
    const ranges = Array.from(root.querySelectorAll('.showcase .ranges button')).map((button) => button.textContent.trim());

    expect(root.querySelector('.showcase .md-drppicker.inline')).not.toBeNull();
    expect(ranges).toEqual(['Today', 'Last 7 days', 'This month']);
  });

  it('shows the chosen range under the calendar', () => {
    Array.from(root.querySelectorAll<HTMLButtonElement>('.showcase .ranges button'))
      .find((button) => button.textContent.trim() === 'Today')
      .click();
    fixture.detectChanges();

    expect(root.querySelector('.chosen').textContent).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/);
  });

  it('links only to pages that exist', () => {
    const paths = routes.map((route) => `/${route.path}`);
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]')).map((link) => link.getAttribute('href'));

    expect(links.length).toBeGreaterThan(6);
    for (const link of links) {
      expect(paths).toContain(link);
    }
  });

  it('copies the install command of the open tab', async () => {
    const writeText = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    root.querySelectorAll<HTMLButtonElement>('.install-tabs button')[1].click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.install .copy').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('npm install ngx-daterangepicker-material');
    expect(root.querySelector('.install .copy').textContent.trim()).toBe('Copied');
  });
});
