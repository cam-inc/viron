import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: 'ap-northeast-1',
});
