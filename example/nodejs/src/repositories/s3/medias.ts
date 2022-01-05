import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

import { LIMIT_MEDIA_FILE_SIZE } from '../../constants';
import { ctx, logger } from '../../context';
import { s3Client } from '../../infrastructures/s3/client';
import { MultiPartBodyParser } from '../../parser/multipart';

const AWSS3Config = ctx.config.aws.s3;

export const uploadMedia = (): MultiPartBodyParser => {
  const key = 'uploadData';
  return {
    handler: multer({
      storage: multerS3({
        s3: s3Client,
        bucket: AWSS3Config.bucketName,
        key: (_req, file, cb) => {
          const fileExtention = path.extname(file.originalname);
          cb(null, `${uuidv4()}${fileExtention}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
      limits: { fileSize: LIMIT_MEDIA_FILE_SIZE },
    }).single(key),

    postHook: async (req): Promise<void> => {
      if (!req.file) {
        return;
      }
      logger.info(`file uploaded! ${JSON.stringify(req.file)}`);
      const file = req.file as Express.MulterS3.File;
      req.body[key] = file.location;
    },
  };
};
