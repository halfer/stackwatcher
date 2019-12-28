const {MongoClient, ObjectId} = require('mongodb');
const markQueryAsRun = require('./_source');

describe('Some tests for markQueryAsRun', () => {
    let connection;
    let db;

    // @todo This is copied from `getNextQuery.test.js`, can we DRY up?
    beforeAll(async () => {
        // See this URL for unified topology: https://stackoverflow.com/a/57899638
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    // @todo This is copied from `getNextQuery.test.js`, can we DRY up?
    afterAll(async () => {
        await connection.close();
        await db.close();
    });

    beforeEach(async () => {
        await getQueriesCollection().deleteMany({});
    });

    test('Successful mark query as run', async () => {
        // @todo Move these into beforeAll or beforeEach?
        global.context = getStitchContext();
        global.BSON = { ObjectId: ObjectId };

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

    test('Fail if the supplied ID does not exist', () => {
        // @todo Add expectations here
    });

    function getQueriesCollection() {
        return db.collection('queries');
    }

    // @todo This is copied from `getNextQuery.test.js`, can we DRY up?
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
