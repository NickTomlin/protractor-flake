const TIMES_TO_FLAKE = process.env.TIMES_TO_FLAKE || 3;

describe('another flakey integration test', function () {
  it('fails, in a horribly consistent manner', function () {
    browser.get(`/flake/${TIMES_TO_FLAKE}`);

    expect($('#success').isPresent()).toBeTruthy();
  });
});
