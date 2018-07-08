class Request {
  getQuery(req) {
    const query = {
      context: req.query.context,
      domain: req.query.domain,
      status: req.query.status,
    };

    // Prune empty keys
    Object.keys(query).forEach(key => (
      query[key] === null) && delete query[key],
    );
    return query;
  }
}

export default Request;
