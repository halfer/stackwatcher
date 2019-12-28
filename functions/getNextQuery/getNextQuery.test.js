const MongoTester = require('../test/mongo-tester');
const getNextQuery = require('./_source');

describe('Some tests for getNextQuery', () => {
    const mongoTester = new MongoTester();

    beforeAll(async () => {
        await mongoTester.connect();
    });

    afterAll(async () => {
        await mongoTester.disconnect();
    });

    beforeEach(() => {
        // Set up global values
        global.context = mongoTester.getStitchContext();
    });

    test('shows an empty query set will return nothing', async () => {
        expect(await getNextQuery()).toBe(null);
    });

    test('shows a recently run query will not be run', async () => {
        // Insert a recently run query
        let queries = mongoTester.getDatabase().collection('queries');
        await queries.insertOne({
            "user_id": 1,
            "phrase": 'hello',
            "last_run_at": new Date()
        });

        expect(await getNextQuery()).toBe(null);
    });

    test('shows query that has not been run will be run', async () => {
        // Insert a query that has never been run
        let queries = mongoTester.getDatabase().collection('queries');
        await queries.insertOne(createQueryDoc(null));

        // We should get a query this time
        let queryObject = await getNextQuery();
        expect(queryObject.phrase).toBe('hello');
    });

    test('shows query that needs running will be run', async () => {
        // Calculate an "old" time
        let lastRunAt = new Date();
        lastRunAt.setTime(
            lastRunAt.getTime() - (1000 * 60 * 60 * 5)
        );

        // Insert a query that needs to be run
        let queries = mongoTester.getDatabase().collection('queries');
        await queries.insertOne(createQueryDoc(lastRunAt));

        // We should get a query this time
        let queryObject = await getNextQuery();
        expect(queryObject.phrase).toBe('hello');
    });

    function createQueryDoc(lastRunAt) {
        return {
            "user_id": 1,
            "phrase": 'hello',
            "last_run_at": lastRunAt,
            "enabled": true
        }
    }
});
