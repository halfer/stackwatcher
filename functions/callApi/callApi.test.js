const callApi = require('./_source');

describe('Some tests for callApi', () => {

    beforeAll(async () => {
        const httpService = getHttpService();
    });

    test('Simple fetch with no user', async () => {

        // This inserts the service and value getters globally
        const httpService = getHttpService();
        global.context = getDefaultContext(httpService);

        expect(await callApi('hello')).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW'
        );
    });

    test('Simple fetch with user', async () => {

        // This inserts the service and value getters globally
        const httpService = getHttpService();
        global.context = getDefaultContext(httpService);

        expect(await callApi('hello', 54321)).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW&user=54321'
        );
    });

    test('Simple fetch with multiple words', async () => {

        // This inserts the service and value getters globally
        const httpService = getHttpService();
        global.context = getDefaultContext(httpService);

        expect(await callApi('hello world')).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello%20world&filter=!--uPQ.wqQ0zW'
        );
    });

    test('HTTP response not in JSON', async () => {

    });

    test('JSON response not in correct format', async () => {

    })

    function getDefaultContext(httpService) {
        // Mock the service getter
        const serviceGetter = jest.fn(service => httpService);

        // Mock the value getter
        const valueGetter = jest.fn(keyName => 'https://example.com/2.2/search/excerpts');

        return {
            services: {get: serviceGetter},
            values: {get: valueGetter}
        };
    }

    function getHttpService() {
        const textFunc = function () {
            return '{"total": 123}';
        };
        const promise = new Promise(function (resolve, reject) {
            resolve({
                body: {
                    text: textFunc
                }
            });
        });
        const httpService = {get: jest.fn(options => promise)};

        return httpService;
    }
});