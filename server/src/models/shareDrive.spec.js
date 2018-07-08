import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('ShareDrive', () => {
  let model;
  let smbStub;
  let existsStub;

  it('sets up a connection to the share drive', async () => {
    existsStub = sinon.stub().yields(null, true);
    smbStub = sinon.stub().returns({
      exists: existsStub,
    });
    model = proxyquire('./shareDrive.js', {
      smb2: smbStub,
    });
    const directory = '/DESIGNERS';
    const result = await model.exists(directory);
    sinon.assert.calledOnce(smbStub);
    sinon.assert.calledWith(smbStub, sinon.match({
      autoCloseTimeout: 5000,
      domain: 'somecompany.com',
      share: '\\\\studio_test',
      username: 'svc_stutst_app',
    }));
  });

  describe('exists', () => {
    it('returns true if directory exists', async () => {
      existsStub = sinon.stub().yields(null, true);
      smbStub = sinon.stub().returns({
        exists: existsStub,
      });
      model = proxyquire('./shareDrive.js', {
        smb2: smbStub,
      });
      const directory = '/DESIGNERS';
      const result = await model.exists(directory);
      expect(result).to.equal(true);
    });

    it('returns false if does not exists', async () => {
      existsStub = sinon.stub().yields(null, false);
      smbStub = sinon.stub().returns({
        exists: existsStub,
      });
      model = proxyquire('./shareDrive.js', {
        smb2: smbStub,
      });

      const directory = '/DESIGNERS';
      try {
        await model.exists(directory);
      } catch (err) {
        expect(err.message).to.equal('Match not found');
      }
    });

    it('handle errors', async () => {
      existsStub = sinon.stub().yields('has an error');
      smbStub = sinon.stub().returns({
        exists: existsStub,
      });
      model = proxyquire('./shareDrive.js', {
        smb2: smbStub,
      });

      const directory = '/DESIGNERS';
      try {
        await model.exists(directory);
      } catch (err) {
        expect(err).to.equal('has an error');
      }
    });
  });

  describe('create', () => {
    it('creates a directory', async () => {
      const createStub = sinon.stub().yields(null, true);
      smbStub = sinon.stub().returns({
        mkdir: createStub,
      });
      model = proxyquire('./shareDrive.js', {
        smb2: smbStub,
      });
      const directory = 'DESIGNERS';
      const result = await model.create(directory);
      expect(result).to.deep.equal([true, true]);
    });

    it('handles errors', async () => {
      const createStub = sinon.stub().yields('error creating');
      smbStub = sinon.stub().returns({
        mkdir: createStub,
      });
      model = proxyquire('./shareDrive.js', {
        smb2: smbStub,
      });
      const directory = 'DESIGNERS';
      try {
        await model.create(directory);
      } catch (err) {
        expect(err).to.equal('error creating');
      }
    });

    it('throws an error when an incorrect directory path is passed', async () => {
      const directory = 'DESIGNERS\\';
      try {
        await model.create(directory);
      } catch (err) {
        expect(err.message).to.equal('Directory path has invalid characters');
      }
    });
  });
});
