const findAndRunQueries = require('./_source');

describe('Some tests for findAndRunQueries', () => {
    let globalMocks = {};

    // context.functions.execute() becomes a mock
    global.context = {
        functions: {
            execute: jest.fn((funcName, ...params) => {
                // This calls a mock that we set up per test
                return globalMocks[funcName](...params);
            })
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('No queries need to be run', async () => {
        // Don't need to mock other funcs if this one is falsey
        setGlobalMock('getNextQuery', () => {
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

        setGlobalMock('markQueryAsRun', (queryId) => {
            // Does not need to return anything
        });

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

        setGlobalMock('markQueryAsRun', (queryId) => {
            // Does not need to return anything
        });

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
        // @todo Ensure runQuery is called twice
        // @todo Ensure markQueryAsRun is called once
    });

    /**
     * Sets the getNextQuery mock to produce `n` queries before returning null
     *
     * @param n
     */
    function produceNNextQueries(n) {
        let callCount = 0;
        setGlobalMock('getNextQuery', () => {
            if (callCount++ < n) {
                return {
                    something: 'fixme'
                };
            } else {
                return null;
            }
        });
    }

    function produceNSuccessfulQueries(n) {
        let callCount = 0;
        setGlobalMock('runQuery', (query) => {
            return callCount++ < n;
        });
    }

    function setGlobalMock(funcName, func) {
        globalMocks[funcName] = func;
    }

    function getNthMockFunctionCall(n) {
        return global.context.functions.execute.mock.calls[n];
    }

    function countMockFunctionCalls() {
        return global.context.functions.execute.mock.calls.length;
    }
});
