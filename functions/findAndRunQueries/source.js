exports = async function(delay) {
    /**
     * @todo The lambda only has 60 seconds to run, so it should test how
     * long it has been running in the loop, and exit before it gets to,
     * say, 50 seconds.
     */

    let query;
    let ok;
    let count = 0;

    for (let i = 0; i < 5; i++) {
        query = await context.functions.execute('getNextQuery');
        if (query) {
            ok = context.functions.execute('runQuery', query.phrase, query.user_id);
            if (ok) {
                await context.functions.execute('markQueryAsRun', query._id);
                count++;
            }
        } else {
            break;
        }

        // Be nice to the API
        await sleep(delay);
    }

    return count;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
