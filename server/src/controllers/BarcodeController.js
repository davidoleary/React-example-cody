import wrap from 'express-async-wrap';
import 'isomorphic-fetch';
import HttpsProxyAgent from 'http-proxy-agent';

import { Response, ErrorResponse } from '../helpers/response';
import config from '../../config/default';

const BARCODE_NOT_FOUND = 'BARCODE_NOT_FOUND';
const INVAID_BARCODE = 'INVAID_BARCODE';
const NAV_REQUEST_ERROR = 'NAV_REQUEST_ERROR';

/**
 * Get
 * @param req
 * @param res
 * @param next
 */
const get = wrap(async (req, res) => {
  try {
    const itemNumber = req.params.id;

    const url = `${config.nav.host}${config.nav.endpoint}?$filter=Barcode eq '${itemNumber}'&$format=json`;
    const response = await fetch(
      url,
      {
        agent: new HttpsProxyAgent(config.proxy.agent),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const data = await response.json();

    if (data['odata.error']) {
      res.status(400).json(
        new ErrorResponse()
          .setError(data['odata.error'].message.value, INVAID_BARCODE)
          .getResponse(),
      );
      return;
    }

    if (data.value.length === 0) {
      res.status(404).json(
        new ErrorResponse()
          .setError('Barcode not found', BARCODE_NOT_FOUND)
          .getResponse(),
      );
      return;
    }

    res.json(
      new Response()
        .setContent({
          barcode: data.value,
        })
        .getResponse(),
    );
  } catch (e) {
    console.log(e);
    res.status(503).json(
      new ErrorResponse()
        .setError('Nav service Unavailable', NAV_REQUEST_ERROR)
        .getResponse(),
    );
  }
});

export default { get };

