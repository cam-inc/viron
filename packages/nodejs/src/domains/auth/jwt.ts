import http from 'http';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import {
  AUTH_SCHEME,
  DEFAULT_JWT_EXPIRATION_SEC,
  JWT_HASH_ALGORITHM,
} from '../../constants';
import { jwtUninitialized } from '../../errors';
import { getDebug } from '../../logging';
import { isSignedout } from './signout';

const debug = getDebug('domains:auth:jwt');

export type ProviderFunction = (req?: http.IncomingMessage) => {
  issuer: string;
  audience: string[];
};

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
  aud: string;
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

  private getIssuerAndAudience(req?: http.IncomingMessage): {
    issuer: string;
    audience: string[];
  } {
    if (typeof this.provider === 'string') {
      return {
        issuer: this.provider,
        audience: [this.provider],
      };
    }
    return this.provider(req);
  }

  // 署名
  sign(subject: string, req?: http.IncomingMessage): string {
    const now = Math.floor(Date.now() / 1000);
    const { issuer, audience } = this.getIssuerAndAudience(req);
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
    req?: http.IncomingMessage
  ): Promise<JwtClaims | null> {
    const [scheme, credentials, ...unexpects] = token.split(' ');
    if (unexpects?.length || !regExpAuthScheme.test(scheme)) {
      return null;
    }
    const { issuer, audience } = this.getIssuerAndAudience(req);
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
        (err: Error | null, decoded?: JwtPayload): void => {
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
export const initJwt = (config: JwtConfig, force = false): Jwt => {
  if (!jwt || force) {
    jwt = new Jwt(config);
  }
  return jwt;
};

// JWT生成
export const signJwt = (
  subject: string,
  req?: http.IncomingMessage
): string => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return jwt.sign(subject, req);
};

// JWT検証
export const verifyJwt = async (
  token?: string | null,
  req?: http.IncomingMessage
): Promise<JwtClaims | null> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  if (!token) {
    return null;
  }
  if (await isSignedout(token)) {
    debug('Already signed out. token: %s', token);
    return null;
  }
  return await jwt.verify(token, req);
};
