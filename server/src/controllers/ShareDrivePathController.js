import wrap from 'express-async-wrap';
import { MatchNotFound, MATCH_NOT_FOUND, INVALID_KEY } from '../errors';
import { Response, ErrorResponse } from '../helpers/response';
import shareDriveModel from '../models/shareDrive';

const post = wrap(async (req, res) => {
  try {
    if (!req.body.key) {
      return res.status(400).json(
        new ErrorResponse()
          .setError('Invalid Key Supplied', INVALID_KEY)
          .getResponse(),
      );
    }

    const data = await shareDriveModel.create(decodeURI(req.body.key));

    return res.json(
      new Response()
        .setContent({
          path: data,
        })
        .getResponse(),
    );
  } catch (e) {
    return res.status(500).json(
      new ErrorResponse()
        .setError(e.message, e.code)
        .getResponse(),
    );
  }
});

/**
 * Get a bucket path
 * @param req
 * @param res
 * @param next
 */
const get = wrap(async (req, res) => {
  try {
    if (!req.query.key) {
      return res.status(400).json(
        new ErrorResponse()
          .setError('Invalid Key Supplied', INVALID_KEY)
          .getResponse(),
      );
    }

    console.log('info:', 'checking exists', req.query.key);
    const exists = await shareDriveModel.exists(req.query.key);

    return res.json(
      new Response()
        .setContent({
          path: exists,
        })
        .getResponse(),
    );
  } catch (e) {
    if (e instanceof MatchNotFound) {
      return res.status(404).json(
        new ErrorResponse()
          .setError(e.message, MATCH_NOT_FOUND)
          .getResponse(),
      );
    }
    return res.status(500).json(
      new ErrorResponse()
        .setError(e.message, e.code)
        .getResponse(),
    );
  }
});

export default { get, post };
