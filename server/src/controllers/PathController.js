import wrap from 'express-async-wrap';

import config from '../../config/default';
import { MatchNotFound, MATCH_NOT_FOUND, INVALID_KEY } from '../errors';
import { Response, ErrorResponse } from '../helpers/response';
import s3Model from '../models/s3';

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

    const data = await s3Model.listObjects({
      Prefix: req.query.key,
      // todo: move to config.bucket
      Bucket: config.bucket,
    });

    return res.json(
      new Response()
        .setContent({
          path: data,
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

    // catch errors thrown by aws-sdk
    return res.status(500).json(
      new ErrorResponse()
        .setError(e.message, e.code)
        .getResponse(),
    );
  }
});

/**
 * Create a bucket path
 */
const post = wrap(async (req, res) => {
  try {
    if (!req.body.key) {
      return res.status(400).json(
        new ErrorResponse()
          .setError('Invalid Key Supplied', INVALID_KEY)
          .getResponse(),
      );
    }

    const data = await s3Model.putObject({
      Bucket: config.bucket,
      Key: decodeURI(req.body.key),
    });

    return res.json(
      new Response()
        .setContent({
          path: data,
        })
        .getResponse(),
    );
  } catch (e) {
    // catch errors thrown by aws-sdk
    return res.status(500).json(
      new ErrorResponse()
        .setError(e.message, e.code)
        .getResponse(),
    );
  }
});

export default { get, post };
