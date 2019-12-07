const callApi = require('./_source');

test('Simple fetch with no user', () => {

    // Mock the service getter
    const promise = { then: jest.fn(response => 123) };
    const httpService = { get: jest.fn(options => promise) };
    const serviceGetter = jest.fn(service => httpService);

    // Mock the value getter
    const valueGetter = jest.fn(keyName => 'https://example.com/2.2/search/excerpts');

    // This inserts the service and value getters globally
    global.context = {
        services: { get: serviceGetter },
        values: { get: valueGetter }
    };

    expect(callApi('hello')).toBe(123);

    // Check the mocks are behaving as expected
    expect(valueGetter.mock.calls[0][0]).toBe('stackOverflowApiUrl');
    expect(serviceGetter.mock.calls[0][0]).toBe('HTTP');
    expect(httpService.get.mock.calls[0][0].url).toBe(
        'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&user=40933&filter=!--uPQ.wqQ0zW'
    );
});
