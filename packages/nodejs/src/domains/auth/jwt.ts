import http from 'http';
import { JwtPayload, sign, verify, decode } from 'jsonwebtoken';
import {
  AUTH_SCHEME,
  DEFAULT_JWT_EXPIRATION_SEC,
  JWT_HASH_ALGORITHM,
} from '../../constants';
import { jwtUninitialized } from '../../errors';
import { getDebug } from '../../logging';
import { isSignedout } from './signout';

const debug = getDebug('domains:auth:jwt');

export type ProviderFunction = (req: http.IncomingMessage) => Promise<{
  issuer: string;
  audience: string[];
}>;

export interface JwtConfig {
  secret: string;
  provider: string | ProviderFunction;
  expirationSec?: number;
}

export interface JwtClaims {
  exp: number;
  iat: number;
  nbf: number;
  sub: string;
  iss: string;
  aud: string | string[];
}

const regExpAuthScheme = new RegExp(`^${AUTH_SCHEME}$`, 'i');

class Jwt {
  secret!: string;
  provider!: string | ProviderFunction;
  expirationSec!: number;

  constructor(config: JwtConfig) {
    this.secret = config.secret;
    this.provider = config.provider;
    this.expirationSec = config.expirationSec ?? DEFAULT_JWT_EXPIRATION_SEC;
  }

  private async getIssuerAndAudience(req: http.IncomingMessage): Promise<{
    issuer: string;
    audience: string[];
  }> {
    if (typeof this.provider === 'string') {
      return {
        issuer: this.provider,
        audience: [this.provider],
      };
    }
    return this.provider(req);
  }

  // 署名
  async sign(subject: string, req: http.IncomingMessage): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const { issuer, audience } = await this.getIssuerAndAudience(req);
    const token = sign(
      {
        exp: now + this.expirationSec, // 有効期限
        iat: now, // 発行した日時
        nbf: 0, // 有効になる日時
        sub: subject, // ユーザー識別子
        iss: issuer, // 発行者
        aud: audience, // 利用者
      },
      this.secret,
      {
        algorithm: JWT_HASH_ALGORITHM,
      }
    );
    return `${AUTH_SCHEME} ${token}`;
  }

  // 検証
  async verify(
    token: string,
    req: http.IncomingMessage
  ): Promise<JwtClaims | null> {
    const [scheme, credentials, ...unexpects] = token.split(' ');
    if (unexpects?.length || !regExpAuthScheme.test(scheme)) {
      return null;
    }
    const { issuer, audience } = await this.getIssuerAndAudience(req);
    return await new Promise((resolve): void => {
      verify(
        credentials,
        this.secret,
        {
          algorithms: [JWT_HASH_ALGORITHM],
          audience,
          issuer,
          complete: false,
        },
        (err: Error | null, decoded?: JwtPayload | string): void => {
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

  // デコード
  decode(token: string): JwtClaims | null {
    const [scheme, credentials, ...unexpects] = token.split(' ');
    if (unexpects?.length || !regExpAuthScheme.test(scheme)) {
      return null;
    }
    return decode(credentials) as JwtClaims;
  }
}

let jwt: Jwt | undefined;

// 初期化
export const initJwt = (config: JwtConfig, force = false): Jwt => {
  if (!jwt || force) {
    jwt = new Jwt(config);
  }
  return jwt;
};

// JWT生成
export const signJwt = async (
  subject: string,
  req: http.IncomingMessage
): Promise<string> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return await jwt.sign(subject, req);
};

// JWT検証
export const verifyJwt = async (
  token: string,
  req: http.IncomingMessage
): Promise<JwtClaims | null> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  if (await isSignedout(token)) {
    debug('Already signed out. token: %s', token);
    return null;
  }
  return await jwt.verify(token, req);
};

// JWTデコード
export const decodeJwt = async (token: string): Promise<JwtClaims | null> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return jwt.decode(token);
};
