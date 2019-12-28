const {MongoClient} = require('mongodb');

function MongoTester() {
    // Properties
    this.connection = null;
    this.db = null;

    // Functions
    this.connect = connect;
    this.disconnect = disconnect;
    this.getStitchContext = function() {
        return {
            services: {
                get: (serviceName) => {
                    return {
                        db: (databaseName) => {
                            return this.db;
                        }
                    }
                }
            }
        };
    }
    this.getConnection = function() {
        return this.connection;
    }
    this.getDatabase = function() {
        return this.db;
    }
}

async function connect() {
    // See this URL for unified topology: https://stackoverflow.com/a/57899638
    this.connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    this.db = await this.connection.db(global.__MONGO_DB_NAME__);
}

async function disconnect() {
    await this.connection.close();
    await this.db.close();
}

module.exports = MongoTester;
