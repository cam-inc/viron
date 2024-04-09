import { S3 } from '@aws-sdk/client-s3';

import { ctx } from '../../context';

const AWSS3Config = ctx.config.aws.s3;

export const s3Client = new S3({
  credentials: {
    accessKeyId: AWSS3Config.accessKeyId,
    secretAccessKey: AWSS3Config.secretAccessKey,
  },
  region: AWSS3Config.region,
});
