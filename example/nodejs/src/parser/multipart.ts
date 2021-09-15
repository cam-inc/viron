import { BodyParser } from 'exegesis';
import { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

import { s3Client } from '../repositories/aws/s3';
import { logger } from '../context';
import { LIMIT_FILE_SIZE } from '../constants';
import { ctx } from '../context';

const AWSS3Config = ctx.config.auth.awsConfig.s3;

const uploadMediaToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AWSS3Config.bucketName,
    key: function (_req, file, cb) {
      const splitOriginalNameArray = file.originalname.split('.');
      const fileExtention =
        splitOriginalNameArray[splitOriginalNameArray.length - 1];
      cb(null, `${uuidv4()}.${fileExtention}`);
    },
  }),
  limits: { fileSize: LIMIT_FILE_SIZE },
}).single('mediaBinaryData');

export const multiPart: BodyParser = {
  parseReq(req, res, next) {
    const expressRequest = req as Request;
    const expressResponse = res as Response;
    uploadMediaToS3(expressRequest, expressResponse, (error) => {
      if (error) {
        logger.error('file upload errors: %s', error);
        expressResponse.json({
          msg: 'file upload errors',
          error: error,
        });
      } else {
        // If File not found
        if (expressRequest.file === undefined) {
          logger.error('Error: No File Selected!');
          expressResponse.json('Error: No File Selected!');
        } else {
          logger.info('file uploaded!');
          const file = expressRequest.file as Express.MulterS3.File;
          const fileName = file.location.replace(
            `https://s3.${AWSS3Config.region}.amazonaws.com/${AWSS3Config.bucketName}/`,
            ''
          );
          req.body.url = `https://${AWSS3Config.mediaDomain}/${fileName}`;
          req.body.mimeType = file.mimetype;
          next();
        }
      }
    });
  },
};
