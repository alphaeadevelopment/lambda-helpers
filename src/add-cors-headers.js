// const ACCEPTED_ORIGIN_REGEX = /https?:\/\/(kingga-remint-website.s3-website-eu-west-1.amazonaws.com|localhost)(:\d{2,4})?/
const DEFAULT_ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
module.exports = (
  {
    acceptedOriginsRegEx = /https?:\/\/.*/,
    acceptedHeaders = [],
  }
) => (requestHeaders, responseHeaders) => {
  const origin = requestHeaders.origin || requestHeaders.Origin;
  console.log('Got origin: %s', origin);
  const allowedHeaders = DEFAULT_ALLOWED_HEADERS;
  allowedHeaders.push(...acceptedHeaders);
  const corsResponseHeaders = {
    'Access-Control-Allow-Headers': allowedHeaders.join(','),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
  };
  if (origin && origin.match(acceptedOriginsRegEx)) {
    console.log('Origin %s accepted', origin);
    corsResponseHeaders['Access-Control-Allow-Origin'] = origin;
  }
  else {
    console.log('Origin %s rejected', origin);
  }
  return { ...responseHeaders, ...corsResponseHeaders };
};
