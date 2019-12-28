const {MongoClient} = require('mongodb');
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
        await db.collection('queries').deleteMany({});
    });

    test('Successful mark query as run', () => {
        // @todo Add expectations here
    });

    test('Fail if the supplied ID does not exist', () => {
        // @todo Add expectations here
    });

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
