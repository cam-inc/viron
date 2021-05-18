import { sign, verify } from 'jsonwebtoken';
import {
  AUTH_SCHEME,
  DEFAULT_JWT_EXPIRATION_SEC,
  JWT_HASH_ALGORITHM,
} from '../../constants';
import { jwtUninitialized } from '../../errors';
import { getDebug } from '../../logging';

const debug = getDebug('domains:auth:jwt');

export interface JwtConfig {
  secret: string;
  provider: string;
  expirationSec?: number;
}

export interface JwtClaims {
  exp: number;
  iat: number;
  nbf: number;
  sub: string;
  iss: string;
  aud: string;
}

const regExpAuthScheme = new RegExp(`^${AUTH_SCHEME}$`, 'i');

class Jwt {
  secret!: string;
  provider!: string;
  expirationSec!: number;

  constructor(config: JwtConfig) {
    this.secret = config.secret;
    this.provider = config.provider;
    this.expirationSec = config.expirationSec ?? DEFAULT_JWT_EXPIRATION_SEC;
  }

  // 署名
  sign(subject: string): string {
    const now = Math.floor(Date.now() / 1000);
    const token = sign(
      {
        exp: now + this.expirationSec, // 有効期限
        iat: now, // 発行した日時
        nbf: 0, // 有効になる日時
        sub: subject, // ユーザー識別子
        iss: this.provider, // 発行者
        aud: this.provider, // 利用者
      },
      this.secret,
      {
        algorithm: JWT_HASH_ALGORITHM,
      }
    );
    return `${AUTH_SCHEME} ${token}`;
  }

  // 検証
  async verify(token: string): Promise<JwtClaims | null> {
    const [scheme, credentials, ...unexpects] = token.split(' ');
    if (unexpects?.length || !regExpAuthScheme.test(scheme)) {
      return null;
    }
    return await new Promise((resolve): void => {
      verify(
        credentials,
        this.secret,
        {
          algorithms: [JWT_HASH_ALGORITHM],
          audience: this.provider,
          issuer: this.provider,
        },
        // eslint-disable-next-line @typescript-eslint/ban-types
        (err: Error | null, decoded: object | undefined): void => {
          if (err) {
            debug(err);
            return resolve(null);
          }
          debug('decoded claims:', decoded);
          resolve(decoded ? (decoded as JwtClaims) : null);
        }
      );
    });
  }
}

let jwt: Jwt | undefined;

// 初期化
export const initJwt = (config: JwtConfig): Jwt => {
  if (!jwt) {
    jwt = new Jwt(config);
  }
  return jwt;
};

// JWT生成
export const signJwt = (subject: string): string => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return jwt.sign(subject);
};

// JWT検証
export const verifyJwt = async (token: string): Promise<JwtClaims | null> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return await jwt.verify(token);
};
