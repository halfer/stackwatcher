exports = async function(queryId) {
    const database = context.services.get("mongodb-atlas").db("stack_watcher"),
        queriesCollection = database.collection("queries"),
        timeStamp = new Date(),
        runLog = {
            type: 'RUN',
            time: timeStamp
        };

    await queriesCollection.updateOne(
        { _id: BSON.ObjectId(queryId) },
        {
            $set: {
                last_run_at: timeStamp
            },
            $push: {
                logs: runLog
            }
        }
    )
};
