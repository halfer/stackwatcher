exports = function(query, userId) {
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

  return http
    .get({ url: urlBase + '?' + options.join('&') })
    .then(response => {
      // The response body is encoded as raw BSON.Binary. Parse it to JSON.
      const ejson_body = EJSON.parse(response.body.text());
      return ejson_body.total;
    });
};
