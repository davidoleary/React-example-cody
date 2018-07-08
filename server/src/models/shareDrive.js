import SMB2 from 'smb2';

import { MatchNotFound } from '../errors';
import config from './../../config/default';

async function serialAsyncMap(collection, fn) {
  const result = [];
  // eslint-disable-next-line
  for (const item of collection) {
    // eslint-disable-next-line
    result.push(await fn(item));
  }
  return result;
}

function getDirectoryPathParts(directoryPath) {
  const directoryParts = directoryPath.split('/').reduce((previous, current) => {
    if (previous.length === 0) {
      return [current];
    }
    const combined = `${previous[previous.length - 1]}/${current}`;
    previous.push(combined);
    return previous;
  }, []);

  return directoryParts;
}

function getClient() {
  const smb2Client = new SMB2({
    share: config.share.drive,
    domain: config.share.domain,
    username: config.share.username,
    password: config.share.password,
    autoCloseTimeout: 5000,
  });

  return smb2Client;
}

const exists = async directory => new Promise((resolve, reject) => {
  console.log('check:', `${config.share.routeFolder}/${directory}`);

  const smb2Client = getClient();

  smb2Client.exists(`${config.share.routeFolder}/${directory}`, (err, directoryExists) => {
    console.log('check response:', `${config.share.routeFolder}/${directory}`, directoryExists);

    if (err) {
      reject(err);
      smb2Client.close();
      return;
    }

    if (!directoryExists) {
      reject(new MatchNotFound('Match not found'));
      smb2Client.close();
      return;
    }

    resolve(directoryExists);
  });
});

function createSingleDirectory(smb2Client) {
  return async directory => new Promise((resolve, reject) => {
    // TODO: replace console with mf-logger
    console.log('info: creating: ', directory);
    smb2Client.mkdir(directory, (err, createResult) => {
      if (err) {
        // just continue to the next direcory is the current directory already exists.
        if (err.message !== 'File/Folder already exists') {
          console.log('error: ', err.message, directory);
          return reject(err);
        }
        console.log('warning: ', err.message, directory);
      }
      return resolve(createResult);
    });
  });
}

const create = async (directoryPath) => {
  if (directoryPath.indexOf('\\') > -1) {
    throw new Error('Directory path has invalid characters');
  }

  const smb2Client = getClient();

  const directoryParts = getDirectoryPathParts(`${config.share.routeFolder}/${directoryPath}`);
  return serialAsyncMap(directoryParts, createSingleDirectory(smb2Client));
};

export default { exists, create };
