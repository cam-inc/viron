import fs from 'fs';
import path from 'path';
import { SecureContextOptions } from 'tls';

export const getCertificate = (): SecureContextOptions => {
  return {
    cert: fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.crt')
    ),
    key: fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.key')
    ),
  };
};
