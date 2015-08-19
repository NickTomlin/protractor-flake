describe('A test that passes', () => {
  it('passes', () => {
    browser.get('/');

    expect($('#home').isPresent()).toBeTruthy();
  });
});
