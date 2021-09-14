import * as http from 'http';
import { HttpIncomingMessage } from 'exegesis';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { s3 } from '../repositories/s3';

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'local-media.viron.work',
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_req, file, cb) {
      cb(null, Date.now() + encodeURI(file.originalname));
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
}).single('filePath');

export const multiPart = (
  req: HttpIncomingMessage,
  res: http.ServerResponse,
  next: NextFunction
): any => {
  const expressRequest = req as Request;
  const expressResponse = res as Response;
  profileImgUpload(expressRequest, expressResponse, (error) => {
    console.log(expressRequest.file);
    if (error) {
      console.log('errors', error);
    } else {
      // If File not found
      if (expressRequest.file === undefined) {
        console.log('Error: No File Selected!');
      } else {
        console.log('file uploaded!');
        const file = expressRequest.file as Express.MulterS3.File;
        req.body.filePath = file.location.replace(
          's3.ap-northeast-1.amazonaws.com/',
          ''
        );
        req.body.contentType = file.mimetype;
        next();
      }
    }
  });
};
