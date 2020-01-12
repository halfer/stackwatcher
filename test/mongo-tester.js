const {MongoClient} = require('mongodb');

function MongoTester() {
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
        this.db = await this.connection.db(global.__MONGO_DB_NAME__);
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

    this.emptyCollections = function(collections) {
        // Interesting note - how can I do deleteMany without async, but
        // wait for all promises to finish before the end of emptyCollections?
        collections.forEach(async (collectionName) => {
            let collection = this.getDatabase().collection(collectionName);
            await collection.deleteMany({});
        });
    };

    this.getConnection = function() {
        return this.connection;
    };

    this.getDatabase = function() {
        return this.db;
    };
}

module.exports = MongoTester;
