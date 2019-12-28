const {MongoClient} = require('mongodb');
const getNextQuery = require('./_source');

describe('Some tests for getNextQuery', () => {
    let connection;
    let db;

    beforeAll(async () => {
        // See this URL for unified topology: https://stackoverflow.com/a/57899638
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    afterAll(async () => {
        await connection.close();
        await db.close();
    });

    beforeEach(() => {
        // Set up global values
        global.context = getStitchContext();
    });

    test('shows an empty query set will return nothing', async () => {
        expect(await getNextQuery()).toBe(null);
    });

    test('shows a recently run query will not be run', async () => {
        // Insert a recently run query
        let queries = db.collection('queries');
        await queries.insertOne({
            "user_id": 1,
            "phrase": 'hello',
            "last_run_at": new Date()
        });

        expect(await getNextQuery()).toBe(null);
    });

    test('shows query that has not been run will be run', async () => {
        // Insert a query that has never been run
        let queries = db.collection('queries');
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
        let queries = db.collection('queries');
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

    function getStitchContext() {
        return {
            services: {
                get: function(serviceName) {
                    return {
                        db: function(databaseName) {
                            return db;
                        }
                    }
                }
            }
        };
    }
});
