import AWS from 'aws-sdk';

import { MatchNotFound } from '../errors';

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'eu-west-1',
});
const client = new AWS.S3();

const listObjects = async (params) => {
  const data = await client.listObjectsV2(params).promise();

  if (data.KeyCount === 0) {
    throw new MatchNotFound('Match not found');
  }

  return data;
};

const putObject = async (params) => {
  const data = await client.putObject(params).promise();

  return data;
};

const s3 = { listObjects, putObject };

export default s3;
