const findAndRunQueries = require('./_source');

describe('Some tests for findAndRunQueries', () => {
    let globalFuncs = {};

    /**
     * Reset the global funcs object
     */
    beforeAll(() => {
        global.context = {
            functions: {
                execute: (funcName, ...params) => {
                    globalFuncs[funcName](...params);
                }
            }
        };
    });

    test('No queries need to be run', async () => {
        // Don't need to mock other funcs if this one is falsey
        setGlobalFunctionMock('getNextQuery', () => {
            return null;
        });

        await findAndRunQueries(0);

        // @todo Ensure runQuery is not called
        // @todo Ensure markQueryAsRun is not called
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
});
