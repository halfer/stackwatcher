const findAndRunQueries = require('./_source');
const StitchFuncMocking = require('../../test/stitch-func-mocking');

describe('Some tests for findAndRunQueries', () => {
    const stitchFuncMocking = new StitchFuncMocking();

    // context.functions.execute() becomes a mock
    global.context = {};
    global.context.functions = stitchFuncMocking.getFunctionsObject(jest);

    beforeEach(() => {
        jest.clearAllMocks();
        stitchFuncMocking.clearMocks();
    });

    test('No queries need to be run', async () => {
        // Don't need to mock other funcs if this one is falsey
        stitchFuncMocking.setGlobalMock('getNextQuery', () => {
            return null;
        });

        await findAndRunQueries(0);

        // Ensure only getNextQuery is called
        expect(getNthMockFunctionCall(0)[0]).toBe('getNextQuery');
        expect(countMockFunctionCalls()).toBe(1);
    });

    test('One query needs to be run', async () => {
        produceNNextQueries(1);
        produceNSuccessfulQueries(1);
        mockQueryMarker();

        await findAndRunQueries(0);

        // Ensure each func is called
        expect(getNthMockFunctionCall(0)[0]).toBe('getNextQuery');
        expect(getNthMockFunctionCall(1)[0]).toBe('runQuery');
        expect(getNthMockFunctionCall(2)[0]).toBe('markQueryAsRun');

        // We have a last call here, which returns null to terminate the loop early
        expect(getNthMockFunctionCall(3)[0]).toBe('getNextQuery');

        // Ensure there is no extra calls
        expect(countMockFunctionCalls()).toBe(4);
    });

    test('Two queries need to be run', async () => {
        produceNNextQueries(2);
        produceNSuccessfulQueries(2);
        mockQueryMarker();

        await findAndRunQueries(0);

        // Ensure each func is called twice
        for(let i = 0; i < 4; i+=3) {
            expect(getNthMockFunctionCall(i + 0)[0]).toBe('getNextQuery');
            expect(getNthMockFunctionCall(i + 1)[0]).toBe('runQuery');
            expect(getNthMockFunctionCall(i + 2)[0]).toBe('markQueryAsRun');
        }

        // We have a last call here, which returns null to terminate the loop early
        expect(getNthMockFunctionCall(6)[0]).toBe('getNextQuery');

        // Ensure there is no extra calls
        expect(countMockFunctionCalls()).toBe(7);
    });

    test('Two queries, one fails', async () => {
        produceNNextQueries(2);
        produceNSuccessfulQueries(1);
        mockQueryMarker();

        await findAndRunQueries(0);

        // Mock one succcess, one failure
        expect(getNthMockFunctionCall(0)[0]).toBe('getNextQuery');
        expect(getNthMockFunctionCall(1)[0]).toBe('runQuery');
        expect(getNthMockFunctionCall(2)[0]).toBe('markQueryAsRun');
        expect(getNthMockFunctionCall(3)[0]).toBe('getNextQuery');
        expect(getNthMockFunctionCall(4)[0]).toBe('runQuery');

        // We have a last call here, which returns null to terminate the loop early
        expect(getNthMockFunctionCall(5)[0]).toBe('getNextQuery');

        // Ensure there is no extra calls
        expect(countMockFunctionCalls()).toBe(6);
    });

    /**
     * Sets the getNextQuery mock to produce `n` queries before returning null
     *
     * @param n
     */
    function produceNNextQueries(n) {
        let callCount = 0;
        stitchFuncMocking.setGlobalMock('getNextQuery', () => {
            if (callCount++ < n) {
                return {
                    phrase: 'hello',
                    user_id: null
                };
            } else {
                return null;
            }
        });
    }

    function produceNSuccessfulQueries(n) {
        let callCount = 0;
        stitchFuncMocking.setGlobalMock('runQuery', (query) => {
            return callCount++ < n;
        });
    }

    function mockQueryMarker() {
        stitchFuncMocking.setGlobalMock('markQueryAsRun', (queryId) => {
            // Does not need to return anything
        });
    }

    function getNthMockFunctionCall(n) {
        return global.context.functions.execute.mock.calls[n];
    }

    function countMockFunctionCalls() {
        return global.context.functions.execute.mock.calls.length;
    }
});
