const callApi = require('./_source');

describe('Some tests for callApi', () => {
    let httpService;

    beforeEach(async () => {
        // This inserts the service and value getters globally
        httpService = getHttpService();
        global.context = getDefaultContext(httpService);
    });

    test('Simple fetch with no user', async () => {

        expect(await callApi('hello')).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW'
        );
    });

    test('Simple fetch with user', async () => {

        expect(await callApi('hello', 54321)).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello&filter=!--uPQ.wqQ0zW&user=54321'
        );
    });

    test('Simple fetch with multiple words', async () => {

        expect(await callApi('hello world')).toBe(123);

        // Check the mocks are behaving as expected
        expect(global.context.values.get.mock.calls[0][0]).toBe('stackOverflowApiUrl');
        expect(global.context.services.get.mock.calls[0][0]).toBe('HTTP');
        expect(httpService.get.mock.calls[0][0].url).toBe(
            'https://example.com/2.2/search/excerpts?order=desc&sort=activity&site=stackoverflow&q=hello%20world&filter=!--uPQ.wqQ0zW'
        );
    });

    test('HTTP response not in JSON', async () => {
        // FIXME
    });

    test('JSON response not in correct format', async () => {

        // Overrides the default HTTP service mock
        httpService = getHttpService('{"dodgy-response": 1}');
        global.context = getDefaultContext(httpService);

        try {
            await callApi('hello');
            throw new Error('callApi call should have thrown an error');
        }
        catch (e) {
            expect(e.message).toBe('Response from Stack Overflow not in expected format');
        }
    });

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

    /**
     * Mocks the HTTP service
     *
     * @param jsonResponse Optional JSON response string
     * @returns Promise
     */
    function getHttpService(jsonResponse) {
        const textFunc = () => {
            return jsonResponse === undefined ? '{"total": 123}' : jsonResponse;
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