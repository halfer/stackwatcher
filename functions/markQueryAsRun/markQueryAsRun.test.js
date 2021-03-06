const {ObjectId} = require('mongodb');
const MongoTester = require('../../test/mongo-tester');
const markQueryAsRun = require('./_source');

describe('Some tests for markQueryAsRun', () => {
    const mongoTester = new MongoTester('markQueryAsRun');

    beforeAll(async () => {
        await mongoTester.connect();
    });

    afterAll(async () => {
        await mongoTester.disconnect();
    });

    beforeEach(async () => {
        // Set up global values
        global.context = {
            services: mongoTester.getStitchContext()
        };
        global.BSON = { ObjectId: ObjectId };

        // Truncate all collections in use
        await mongoTester.emptyCollections(['queries']);
    });

    test('Successful mark query as run', async () => {
        // Insert a doc
        let writeResult = await getQueriesCollection().insertOne({
            query: 'Hello'
        });

        // Mark the doc as ran
        await markQueryAsRun(writeResult.insertedId);

        // Check that the document has been modified as expected
        let doc = await getQueriesCollection().findOne({});
        expect(doc).toHaveProperty('last_run_at');
        expect(doc).toHaveProperty('logs');
        expect(doc.logs[0]).toHaveProperty('type');
        expect(doc.logs[0]).toHaveProperty('time');
    });

    test('Throw error if the supplied ID does not exist', async () => {
        const queryId = new BSON.ObjectId('01234567890123456789abcd');
        try {
            // This doc does not exist
            await markQueryAsRun(queryId);
            throw new Error('markQueryAsRun should have thrown an error');
        }
        catch (e) {
            expect(e.message).toBe(`Could not find query '${queryId}'`);
        }
    });

    test('Throw an error if the supplied ID is of the wrong type', async () => {
        try {
            // This should fail as the ID is a string
            await markQueryAsRun('01234567890123456789abcd');
            throw new Error('markQueryAsRun should have thrown an error');
        }
        catch (e) {
            expect(e.message).toBe(`The queryId must be an ObjectId`);
        }
    });

    test('Throw error if the logs subdocument is not an array', async () => {
        // Insert a doc
        let writeResult = await getQueriesCollection().insertOne({
            query: 'Hello',
            logs: {} // Oops, this is an object
        });

        try {
            // Try to mark the doc as ran
            await markQueryAsRun(writeResult.insertedId);
            throw new Error('markQueryAsRun should have thrown an error');
        }
        catch (e) {
            let queryId = writeResult.insertedId;
            expect(e.message).toBe(`The logs for query '${queryId}' are not an array`);
        }
    });

    function getQueriesCollection() {
        return mongoTester.getDatabase().collection('queries');
    }
});
