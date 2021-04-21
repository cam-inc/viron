import fs from 'fs';
import path from 'path';
import { SecureContextOptions } from 'tls';

export const getCertificate = (): SecureContextOptions => {
  return {
    // TODO: 正規のSSL証明書取得したら変更する
    cert: fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'cert', 'STAR_camplat_net.crt')
    ),
    key: fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'cert', 'STAR_camplat_net.key')
    ),
  };
};
