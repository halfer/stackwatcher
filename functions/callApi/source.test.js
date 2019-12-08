const callApi = require('./_source');

test('Simple fetch with no user', () => {

    // This inserts the service and value getters globally
    const httpService = getHttpService();
    global.context = getDefaultContext(httpService);

    expect(callApi('hello')).toBe(123);

    // Check the mocks are behaving as expected
    expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
    expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
    expect(httpService.get.mock.calls[0][0].url).toBe(
        'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW'
    );
});

test('Simple fetch with user', () => {

    // This inserts the service and value getters globally
    const httpService = getHttpService();
    global.context = getDefaultContext(httpService);

    expect(callApi('hello', 54321)).toBe(123);

    // Check the mocks are behaving as expected
    expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
    expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
    expect(httpService.get.mock.calls[0][0].url).toBe(
        'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW&user=54321'
    );
});

function getDefaultContext(httpService) {
    // Mock the service getter
    const serviceGetter = jest.fn(service => httpService);

    // Mock the value getter
    const valueGetter = jest.fn(keyName => 'https://example.com/2.2/search/excerpts');

    return {
        services: { get: serviceGetter },
        values: { get: valueGetter }
    };
}

function getHttpService() {
    const promise = { then: jest.fn(response => 123) };
    const httpService = { get: jest.fn(options => promise) };

    return httpService;
}