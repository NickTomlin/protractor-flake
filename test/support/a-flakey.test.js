const TIMES_TO_FLAKE = process.env.TIMES_TO_FLAKE || 2;

describe('a flakey integration test', function () {
  it('fails, in a horribly consistent manner', function () {
    browser.get(`/flake/${TIMES_TO_FLAKE}`);

    expect($('#success').isPresent()).toBeTruthy();
  });
});
