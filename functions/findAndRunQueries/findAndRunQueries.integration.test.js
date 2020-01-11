// Main SUT
const findAndRunQueries = require('./_source');

// Utility test classes
const MongoTester = require('../../test/mongo-tester');
const StitchFuncMocking = require('../../test/stitch-func-mocking');

// Other functions for the integration test
const getNextQuery = require('../getNextQuery/_source');
const markQueryAsRun = require('../markQueryAsRun/_source');

describe('Some integration tests for findAndRunQueries', () => {
    const mongoTester = new MongoTester();
    const stitchFuncMocking = new StitchFuncMocking();

    beforeAll(async () => {
        await mongoTester.connect();
    });

    afterAll(async () => {
        await mongoTester.disconnect();
    });

    beforeEach(() => {
        // Set up global values
        global.context = {};
        global.context.services = mongoTester.getStitchContext();
        global.context.functions = stitchFuncMocking.getFunctionsObject(jest);

        // Delete existing mocks
        jest.clearAllMocks();

        // Connect some real implementations
        stitchFuncMocking.setGlobalMock('getNextQuery', getNextQuery);
        stitchFuncMocking.setGlobalMock('markQueryAsRun', markQueryAsRun);

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
});
