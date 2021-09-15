import AWS from 'aws-sdk';
import { ctx } from '../../context';

const AWSS3Config = ctx.config.auth.awsConfig.s3;

export const s3Client = new AWS.S3({
  accessKeyId: AWSS3Config.accessKeyId,
  secretAccessKey: AWSS3Config.secretAccessKey,
  region: AWSS3Config.region,
});
