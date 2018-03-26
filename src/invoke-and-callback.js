import { addCorsHeaders } from './index';

const successResponse = (b = {}, corsHeaders) => {
  console.log('successResponse %o', b);
  const headers = (b && b.headers) || {};
  const data = (b && b.data) ? b.data : b;
  return ({
    statusCode: (b && b.statusCode) || 200,
    body: data,
    headers: {
      ...corsHeaders,
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}
const errorResponse = (e = {}, corsHeaders) => {
  return ({
    statusCode: e.statusCode || 500,
    body: JSON.stringify({
      isError: true,
      errorMessage: e.message,
    }),
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

const invokeAndCallback = (corsHeaders) => (func, callback, ...args) => {
  try {
    const rv = func.call(null, ...args)
    if (rv instanceof Promise) {
      rv
        .then(r => {
          console.log('Got promise response %o', r);
          callback(null, successResponse(r, corsHeaders));
          // callback(null, );
        })
        .catch(e => {
          console.error(e.stack);
          callback(null, errorResponse(e, corsHeaders));
        });
    }
    else {
      console.log('Got response %s', JSON.stringify(rv));
      callback(null, successResponse(rv, corsHeaders));
    }
  }
  catch (e) {
    console.error('Caught error %s', JSON.stringify(e));
    console.error(e.stack);
    callback(null, errorResponse(e, corsHeaders));
  }
};
exports.withCorsHeaders = invokeAndCallback;
exports.withoutCorsHeaders = invokeAndCallback({});
