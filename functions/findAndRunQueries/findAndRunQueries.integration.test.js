const MongoTester = require('../../test/mongo-tester');
const findAndRunQueries = require('./_source');
const getNextQuery = require('../getNextQuery/_source');
const markQueryAsRun = require('../markQueryAsRun/_source');

describe('Some integration tests for findAndRunQueries', () => {
    const mongoTester = new MongoTester();
    let globalMocks = {};

    beforeAll(async () => {
        await mongoTester.connect();
    });

    afterAll(async () => {
        await mongoTester.disconnect();
    });

    beforeEach(() => {
        // Set up global values
        global.context = {
            services: mongoTester.getStitchContext()
        };

        // Delete existing mocks
        jest.clearAllMocks();

        // Connect the function calls
        global.context.functions = {
            execute: jest.fn((funcName, ...params) => {
                if (globalMocks[funcName] == undefined) {
                    throw new Error(`Mock function '${funcName}' not defined`);
                }
                // This calls a mock that we set up per test
                return globalMocks[funcName](...params);
            })
        };

        // Connect some real implementations
        setGlobalMock('getNextQuery', getNextQuery);
        setGlobalMock('markQueryAsRun', markQueryAsRun);

        // Truncate all collections in use
        const collections = ['queries'];
        collections.forEach(function (collectionName) {
            let collection = mongoTester.getDatabase().collection(collectionName);
            collection.deleteMany({});
        });
    });

    test('end-to-end test with no queries', async () => {
        expect(await findAndRunQueries(0)).toBe(0);
    });

    test('end-to-end test with one successful query', async () => {
        // FIXME add a query collection here
        // FIXME need to add a mock for runQuery
        expect(await findAndRunQueries(0)).toBe(0);
    });

    test('end-to-end test with one failed query', async () => {
        // FIXME
    });

    function setGlobalMock(funcName, func) {
        globalMocks[funcName] = func;
    }
});
