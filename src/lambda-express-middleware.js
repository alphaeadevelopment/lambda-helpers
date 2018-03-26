import find from 'lodash/find';

const findHandlerFromMappings = mappings => (method, path) => {
  const h = find(mappings, (m) => {
    const matchMethod = m.method === '*' || m.method === method;
    const matchPath = path.match(m.path);
    return (matchMethod && matchPath);
  });
  return (h || {}).handler;
}

const invokeHandler = (handler, req, res) => {
  const event = {
    headers: req.headers,
    body: JSON.stringify(req.body),
    path: req.path,
    httpMethod: req.method,
    queryStringParameters: req.query,
  };
  const context = {

  };
  const callback = (err, response) => {
    if (err) res.status(err.statusCode).set(err.headers).send(err.body);
    else res.status(response.statusCode).set(response.headers).send(response.body)
  };
  handler.call(null, event, context, callback);
}

module.exports = (mappings) => {
  const findHandler = findHandlerFromMappings(mappings);
  return (req, res, next) => {
    const handler = findHandler(req.method, req.path);
    if (handler) invokeHandler(handler, req, res);
    else {
      next();
    }
  };
}
