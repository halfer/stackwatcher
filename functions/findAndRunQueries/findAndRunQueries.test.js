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
        let callCount = 0;

        // Return an object on the first run, null on the second
        setGlobalMock('getNextQuery', () => {
            if (callCount === 0) {
                return {
                    something: 'fixme'
                };
            } else {
                return null;
            }
            callCount++;
        });

        setGlobalMock('runQuery', (query) => {
            return true;
        });

        setGlobalMock('markQueryAsRun', (queryId) => {
            // Does not need to return anything
        });

        await findAndRunQueries(0);

        // Ensure each func is called once
        expect(getNthMockFunctionCall(0)[0]).toBe('getNextQuery');
        expect(getNthMockFunctionCall(1)[0]).toBe('runQuery');
        expect(getNthMockFunctionCall(2)[0]).toBe('markQueryAsRun');
        expect(countMockFunctionCalls()).toBe(3);
    });

    test('Two queries need to be run', async () => {
        // @todo Ensure runQuery is called twice
        // @todo Ensure markQueryAsRun is called twice
    });

    test('Two queries, one fails', async () => {
        // @todo Ensure runQuery is called twice
        // @todo Ensure markQueryAsRun is called once
    });

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
