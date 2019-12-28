const {MongoClient} = require('mongodb');

function MongoTester() {
    this.connection = null;
    this.db = null;
    this.connect = connect;
    this.disconnect = disconnect;
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
