exports = async function(query, userId) {
    const http = context.services.get("HTTP");
    const urlBase = context.values.get("stackOverflowApiUrl");
    const options = [
        'order=desc',
        'sort=activity',
        'site=stackoverflow',
        'q=' + encodeURIComponent(query),
        'filter=!--uPQ.wqQ0zW'
    ];

    // Only add a user filter if it is supplied as a param
    if (typeof userId !== 'undefined') {
        options.push('user=' + userId);
    }

    // Get a response using async await, so that parsing is tested too
    let response = await http.get({ url: urlBase + '?' + options.join('&') });

    // Decode the response body
    const jsonText = JSON.parse(response.body.text());

    // Throw an exception if the response is not in the expected format
    if (jsonText.total === undefined) {
        throw new Error(
            'Response from Stack Overflow not in expected format'
        );
    }

    return jsonText.total;
};
