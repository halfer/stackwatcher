exports = async function(queryId) {
    const database = context.services.get("mongodb-atlas").db("stack_watcher"),
        queriesCollection = database.collection("queries"),
        timeStamp = new Date(),
        runLog = {
            type: 'RUN',
            time: timeStamp
        };

    // Make sure queryId is an object
    if (typeof queryId !== 'object') {
        throw new Error('The queryId must be an ObjectId');
    }

    // Check logs key is of the right type...
    const query = await queriesCollection.findOne(
        { _id: queryId },
        { logs: 1 }
    );

    // @todo Move the exception at the end to here?

    // ... the property not existing is fine
    if (query && 'logs' in query) {
        if (!Array.isArray(query.logs)) {
            throw new Error(`The logs for query '${queryId}' are not an array`);
        }
    }

    const updateResult = await queriesCollection.updateOne(
        { _id: queryId },
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

    return true;
};
