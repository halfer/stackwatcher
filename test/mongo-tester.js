const {MongoClient} = require('mongodb');

function MongoTester(dbSuffix) {
    // Properties
    this.connection = null;
    this.db = null;

    // Functions
    this.connect = async function() {
        // See this URL for unified topology: https://stackoverflow.com/a/57899638
        this.connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = await this.connection.db(global.__MONGO_DB_NAME__ + dbSuffix);
    };

    this.disconnect = async function() {
        await this.connection.close();
        await this.db.close();
    };

    this.getStitchContext = function() {
        return {
            get: (serviceName) => {
                return {
                    db: (databaseName) => {
                        return this.db;
                    }
                }
            }
        };
    };

    /**
     * Empties all named collections
     *
     * @see See https://medium.com/dailyjs/the-pitfalls-of-async-await-in-array-loops-cf9cf713bfeb
     * @param collections
     * @returns {Promise<void>}
     */
    this.emptyCollections = async function(collections) {
        const promises = collections.map(async (collectionName, idx) => {
            await this.getDatabase().collection(collectionName).deleteMany({})
        });

        await Promise.all(promises);
    };

    this.getConnection = function() {
        return this.connection;
    };

    this.getDatabase = function() {
        return this.db;
    };
}

module.exports = MongoTester;
