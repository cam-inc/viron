import path from 'path';

// openapiのパスを取得
export const openapiPath = (name: string): string =>
  path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);

// @viron/libが提供するopenapiのディレクトリ
const libOpenapiDir = `${path.dirname(require.resolve('@viron/lib'))}/openapi`;

// @viron/libが提供するopenapiのパスを取得
export const libOpenapiPath = (name: string): string =>
  `${libOpenapiDir}/${name}.yaml`;
