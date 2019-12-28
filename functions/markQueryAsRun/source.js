exports = async function(queryId) {
    const database = context.services.get("mongodb-atlas").db("stack_watcher"),
        queriesCollection = database.collection("queries"),
        timeStamp = new Date(),
        runLog = {
            type: 'RUN',
            time: timeStamp
        };

    const updateResult = await queriesCollection.updateOne(
        { _id: BSON.ObjectId(queryId) },
        {
            $set: {
                last_run_at: timeStamp
            },
            $push: {
                logs: runLog
            }
        }
    );

    // Ensure we modified something
    if (updateResult.modifiedCount === 0) {
        throw new Error(`Could not find query '${queryId}'`);
    }
};
