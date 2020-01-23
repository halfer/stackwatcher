// Main SUT
const findAndRunQueries = require('./_source');

// Utility test classes
const MongoTester = require('../../test/mongo-tester');
const StitchFuncMocking = require('../../test/stitch-func-mocking');

// Other functions for the integration test
const getNextQuery = require('../getNextQuery/_source');
const markQueryAsRun = require('../markQueryAsRun/_source');

describe('Some integration tests for findAndRunQueries', () => {
    const mongoTester = new MongoTester('findAndRunQueries');
    const stitchFuncMocking = new StitchFuncMocking();

    beforeAll(async () => {
        await mongoTester.connect();
    });

    afterAll(async () => {
        await mongoTester.disconnect();
    });

    beforeEach(async () => {
        // Set up global values
        global.context = {};
        global.context.services = mongoTester.getStitchContext();
        global.context.functions = stitchFuncMocking.getFunctionsObject(jest);

        // Delete existing mocks
        jest.clearAllMocks();
        stitchFuncMocking.clearMocks();

        // Connect some real implementations
        stitchFuncMocking.setGlobalMock('getNextQuery', getNextQuery);
        stitchFuncMocking.setGlobalMock('markQueryAsRun', markQueryAsRun);

        // Truncate all collections in use
        await mongoTester.emptyCollections(['queries']);
    });

    test('end-to-end test with no queries', async () => {
        expect(await findAndRunQueries(0)).toBe(0);
    });

    test('end-to-end test with no queries due', async () => {
        // FIXME
    });

    test('end-to-end test with one successful query', async () => {

        // Here is a query entry
        const db = mongoTester.getDatabase();
        await db.collection('queries').insertOne({
            "user_id": 1,
            "phrase": 'hello',
            "last_run_at": null,
            "enabled": true
        });

        // We need to mock runQuery, as that calls an external API
        stitchFuncMocking.setGlobalMock('runQuery', () => 123);

        // Let's see if we can run a call sucessfully
        expect(await findAndRunQueries(0)).toBe(1);

        // Check that a log entry has been made
        const query = await db.collection('queries').findOne({});
        expect(query.logs.length).toBe(1);
        expect(query.logs[0].type).toBe('RUN');
    });

    test('end-to-end test with one failed query', async () => {
        // FIXME
    });

    test('end-to-end test with a decreased count', async () => {
        // FIXME
    });

    test('end-to-end test with an increased count', async () => {
        // FIXME
    });
});
