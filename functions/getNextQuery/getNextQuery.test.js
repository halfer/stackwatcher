const {MongoClient} = require('mongodb');
const getNextQuery = require('./_source');

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
    });

    afterAll(async () => {
        await connection.close();
        await db.close();
    });

    it('shows an empty query set will return nothing', async () => {
        global.context = getStitchContext();

        expect(await getNextQuery()).toBe(null);
    });

    it('shows a recently run query will not be run', async () => {
        global.context = getStitchContext();

        // Insert a recently run query
        let queries = db.collection('queries');
        await queries.insertOne({
            "user_id": 1,
            "phrase": 'hello',
            "last_run_at": new Date()
        });

        expect(await getNextQuery()).toBe(null);
    });

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
