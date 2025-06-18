import { readFile } from 'fs/promises';
import path from 'path';
import { SecureContextOptions } from 'tls';

export const getCertificate = async (): Promise<SecureContextOptions> => {
  return {
    cert: await readFile(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.crt')
    ),
    key: await readFile(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.key')
    ),
  };
};
