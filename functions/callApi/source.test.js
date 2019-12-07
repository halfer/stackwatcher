const callApi = require('./_source');

test('Simple fetch with no user', () => {
    // FIXME need to put a mock in global.context.services.get
    // FIXME need to put a mock in global.context.values.get
    global.context = {};
    expect(callApi('hello')).toBe(123);
});
