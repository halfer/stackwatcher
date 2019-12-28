const findAndRunQueries = require('./_source');

describe('Some tests for findAndRunQueries', () => {
    let globalFuncs = {};

    // context.functions.execute() becomes a mock
    global.context = {
        functions: {
            execute: jest.fn(globalFunctionHandler)
        }
    };

    test('No queries need to be run', async () => {
        // Don't need to mock other funcs if this one is falsey
        setGlobalFunctionMock('getNextQuery', () => {
            return null;
        });

        await findAndRunQueries(0);

        // Ensure only getNextQuery is called
        expect(getNthMockFunctionCall(0)[0]).toBe('getNextQuery');
        expect(countMockFunctionCalls()).toBe(1);
    });

    test('One query needs to be run', async () => {
        // @todo Ensure runQuery is called once
        // @todo Ensure markQueryAsRun is called once
    });

    test('Two queries need to be run', async () => {
        // @todo Ensure runQuery is called twice
        // @todo Ensure markQueryAsRun is called twice
    });

    test('Two queries, one fails', async () => {
        // @todo Ensure runQuery is called twice
        // @todo Ensure markQueryAsRun is called once
    });

    function setGlobalFunctionMock(funcName, func) {
        globalFuncs[funcName] = func;
    }

    function globalFunctionHandler(...params) {
        return null;
    }

    function getNthMockFunctionCall(n) {
        return global.context.functions.execute.mock.calls[n];
    }

    function countMockFunctionCalls() {
        return global.context.functions.execute.mock.calls.length;
    }
});
