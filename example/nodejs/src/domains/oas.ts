import path from 'path';

// oasのパスを取得
export const oasPath = (name: string): string =>
  path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);
