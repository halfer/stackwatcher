exports = async function(queryId) {
    const database = context.services.get("mongodb-atlas").db("stack_watcher");
    const queriesCollection = database.collection("queries");

    // FIXME Lookup & write here
};
