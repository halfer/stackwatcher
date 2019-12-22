exports = async function() {
    const database = context.services.get("mongodb-atlas").db("stack_watcher");
    const queriesCollection = database.collection("queries");
    const dateTimeFilter = new Date();
    // Four hours
    dateTimeFilter.setTime(
        dateTimeFilter.getTime() - (1000 * 60 * 60 * 4)
    );
    const filter = {
        enabled: true,
        "$or": [
            {last_run_at: { "$lt": dateTimeFilter}},
            {last_run_at: null}
        ]
    };
    const projection = {
        "_id": 1,
        "user_id": 1,
        "phrase": 1
    };
    const sort = {
        "last_run_at": -1
    };
    let queryDoc = await queriesCollection
        .find(filter, projection)
        .sort(sort)
        .limit(1);

    return queryDoc;
};
