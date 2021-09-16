import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

import { BodyParser } from 'exegesis';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { ctx } from '../context';
import { uploadMulterError } from '../errors';
import { LIMIT_FILE_SIZE } from '../constants';
import { logger } from '../context';
import { s3Client } from '../repositories/aws/s3';

const AWSS3Config = ctx.config.aws.s3;

const uploadMediaToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AWSS3Config.bucketName,
    key: function (_req, file, cb) {
      const fileExtention = path.extname(file.originalname);
      cb(null, `${uuidv4()}${fileExtention}`);
    },
  }),
  limits: { fileSize: LIMIT_FILE_SIZE },
}).single('uploadData');

export const multiPart: BodyParser = {
  parseReq(req, res, next) {
    const expressRequest = req as Request;
    const expressResponse = res as Response;
    uploadMediaToS3(expressRequest, expressResponse, (error) => {
      if (error instanceof multer.MulterError) {
        //File Upload Multer Error
        next(uploadMulterError(error));
      } else if (error) {
        next(error);
      }

      // If File not found
      if (expressRequest.file === undefined) {
        logger.info(`No file selected!`);
        next();
      }

      // File Upload Success
      logger.info(`file uploaded! ${expressRequest.file}`);

      const file = expressRequest.file as Express.MulterS3.File;
      const fileName = file.location.replace(
        `https://s3.${AWSS3Config.region}.amazonaws.com/${AWSS3Config.bucketName}/`,
        ''
      );
      req.body.uploadData = `https://${AWSS3Config.mediaDomain}/${fileName}`;
      next();
    });
  },
};
