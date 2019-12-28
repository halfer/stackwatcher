exports = async function(queryId) {
    const database = context.services.get("mongodb-atlas").db("stack_watcher");
    const queriesCollection = database.collection("queries");
    const log = {
        type: 'RUN',
        time: new Date()
    };

    queriesCollection.update(
        { id: new ObjectId(queryId) },
        {
            $push: {
                logs: newLog
            }
        }
    )
};
