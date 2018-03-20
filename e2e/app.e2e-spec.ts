import { AppPage } from './app.po';

describe('test-daterange App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Demo daterangepicker with angular without jquery');
  });
});
