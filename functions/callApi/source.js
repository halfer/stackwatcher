exports = function(query){
  const http = context.services.get("HTTP");
  const urlBase = context.values.get("stackOverflowApiUrl");
  const options = [
    'order=desc',
    'sort=activity',
    'site=stackoverflow',
    'q=' + encodeURIComponent(query),
    'user=40933',
    'filter=!--uPQ.wqQ0zW'
  ];

  return http
    .get({ url: urlBase + '?' + options.join('&') })
    .then(response => {
      // The response body is encoded as raw BSON.Binary. Parse it to JSON.
      const ejson_body = EJSON.parse(response.body.text());
      return ejson_body.total;
    });
};
