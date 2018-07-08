import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('Barcode Controller Get', () => {
  let controller;
  let jsonResponse = { test: 'test' };
  let fetchMock;
  before(() => {
    controller = proxyquire('./BarcodeController', {
      '../../config/default': {
        nav: {
          host: 'fakeHost',
          endpoint: '/fakeEnd',
        },
        proxy: {
          agent: 'testframework',
        },
        cors: true,
      },
    });

    fetchMock = sinon.stub(global, 'fetch').returns({
      json() {
        return jsonResponse;
      },
    });
  });

  after(() => {
    global.fetch.restore();
  });

  it('handles odata error from from NAV', async () => {
    jsonResponse = {
      'odata.error': {
        message: {
          value: 'this is an error',
        },
      },
    };

    const jsonMock = { json: sinon.stub() };
    const statusMock = sinon.stub().returns(jsonMock);

    const req = {
      params: {
        id: 'testId',
      },
    };
    const res = {
      status: statusMock,
    };

    const expetedError = {
      content: {
        error: {
          code: 'INVAID_BARCODE',
          message: 'this is an error',
        },
      },
      head: {},
    };

    await controller.get(req, res);
    sinon.assert.calledWith(fetchMock, 'fakeHost/fakeEnd?$filter=Barcode eq \'testId\'&$format=json');
    sinon.assert.calledWith(statusMock, 400);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('handles no value from from NAV', async () => {
    jsonResponse = {
      value: '',
    };

    const jsonMock = { json: sinon.stub() };
    const statusMock = sinon.stub().returns(jsonMock);

    const req = {
      params: {
        id: 'testId',
      },
    };
    const res = {
      status: statusMock,
    };

    const expetedError = {
      content: {
        error: {
          code: 'BARCODE_NOT_FOUND',
          message: 'Barcode not found',
        },
      },
      head: {},
    };

    await controller.get(req, res);
    sinon.assert.calledWith(fetchMock, 'fakeHost/fakeEnd?$filter=Barcode eq \'testId\'&$format=json');
    sinon.assert.calledWith(statusMock, 404);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('handles response which has a barcode from NAV', async () => {
    jsonResponse = {
      value: '809807349383',
    };

    const jsonMock = sinon.stub();
    const headerMock = sinon.stub();

    const req = {
      params: {
        id: 'testId',
      },
    };

    const res = {
      json: jsonMock,
      header: headerMock,
    };

    const expetedResponse = {
      content: {
        barcode: jsonResponse.value,
      },
      head: {},
    };

    await controller.get(req, res);
    sinon.assert.calledWith(fetchMock, 'fakeHost/fakeEnd?$filter=Barcode eq \'testId\'&$format=json');
    sinon.assert.calledWith(res.json, sinon.match(expetedResponse));
  });
});
