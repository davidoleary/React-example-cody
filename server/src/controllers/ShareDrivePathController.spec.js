import sinon from 'sinon';
import { post, get } from './ShareDrivePathController';
import shareDriveModel from '../models/shareDrive';

describe('ShareDrivePath Controller POST', () => {
  let jsonMock;
  let statusMock;
  let createMock;

  before(() => {
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);
    createMock = sinon.stub(shareDriveModel, 'create');
  });

  it('returns 404 when an invalid key is used', async () => {
    const req = {
      body: {},
    };

    const res = {
      status: statusMock,
    };

    const expetedError = {
      content: {
        error: {
          code: 'INVALID_KEY',
          message: 'Invalid Key Supplied',
        },
      },
      head: {},
    };

    await post(req, res);
    sinon.assert.calledWith(statusMock, 400);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('returns 500 when an error occurs', async () => {
    createMock.throws({ message: 'some error' });
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);

    const req = {
      body: {
        key: 'fakeDirectory',
      },
    };

    const res = {
      status: statusMock,
      json: jsonMock.json,
    };

    const expetedError = {
      content: {
        error: {
          message: 'some error',
        },
      },
      head: {},
    };

    await post(req, res);
    sinon.assert.calledWith(createMock, 'fakeDirectory');
    sinon.assert.calledWith(statusMock, 500);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('returns result of direction creation', async () => {
    createMock.returns(true);
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);

    const req = {
      body: {
        key: 'fakeDirectory',
      },
    };

    const res = {
      status: statusMock,
      json: jsonMock.json,
    };

    const expetedError = {
      content: {
        path: true,
      },
      head: {},
    };

    await post(req, res);
    sinon.assert.calledWith(createMock, 'fakeDirectory');
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });
});

describe('ShareDrivePath Controller GET', () => {
  let jsonMock;
  let statusMock;
  let existsMock;

  before(() => {
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);
    existsMock = sinon.stub(shareDriveModel, 'exists');
  });

  it('returns 400 when an invalid key is used', async () => {
    const req = {
      query: {},
    };

    const res = {
      status: statusMock,
    };

    const expetedError = {
      content: {
        error: {
          code: 'INVALID_KEY',
          message: 'Invalid Key Supplied',
        },
      },
      head: {},
    };

    await get(req, res);
    sinon.assert.calledWith(statusMock, 400);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('returns 500 when an error occurs', async () => {
    existsMock.throws({ message: 'some get error' });
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);

    const req = {
      query: {
        key: 'fakeDirectory',
      },
    };

    const res = {
      status: statusMock,
      json: jsonMock.json,
    };

    const expetedError = {
      content: {
        error: {
          message: 'some get error',
        },
      },
      head: {},
    };

    await get(req, res);
    sinon.assert.calledWith(existsMock, 'fakeDirectory');
    sinon.assert.calledWith(statusMock, 500);
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedError));
  });

  it('returns true for existing directory', async () => {
    existsMock.returns(true);
    jsonMock = { json: sinon.stub() };
    statusMock = sinon.stub().returns(jsonMock);

    const req = {
      query: {
        key: 'fakeDirectory',
      },
    };

    const res = {
      status: statusMock,
      json: jsonMock.json,
    };

    const expetedContent = {
      content: {
        path: true,
      },
      head: {},
    };

    await get(req, res);
    sinon.assert.calledWith(existsMock, 'fakeDirectory');
    sinon.assert.calledWith(jsonMock.json, sinon.match(expetedContent));
  });
});
