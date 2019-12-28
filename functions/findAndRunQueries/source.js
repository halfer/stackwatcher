exports = async function(delay) {
    /**
     * @todo The lambda only has 60 seconds to run, so it should test how
     * long it has been running in the loop, and exit before it gets to,
     * say, 50 seconds.
     */

    let query;
    let ok;
    for (let i = 0; i < 5; i++) {
        query = context.functions.execute('getNextQuery');
        if (query) {
            ok = context.functions.execute('runQuery', query);
            if (ok) {
                context.functions.execute('markQueryAsRun', query.id);
            }
        } else {
            break;
        }

        // Be nice to the API
        await sleep(delay);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
