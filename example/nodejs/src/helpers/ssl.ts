import { readFile } from 'fs/promises';
import path from 'path';
import { SecureContextOptions } from 'tls';

export const getCertificate = async (): Promise<SecureContextOptions> => {
  return {
    cert: await readFile(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.crt')
    ).catch(() => process.env.SSL_CERTIFICATE),
    key: await readFile(
      path.resolve(__dirname, '..', '..', 'cert', 'viron.key')
    ).catch(() => process.env.SSL_PRIVATE_KEY),
  };
};
