import { Issuer, generators, Client, TokenSet } from 'openid-client';
import { getDebug } from '../../logging';
import { signJwt } from './jwt';
const debug = getDebug('domains:auth:googleoauth2');
import {
  forbidden,
  invalidGoogleOAuth2Token,
  signinFailed,
} from '../../errors';
import { createOne, findOneByEmail } from '../adminuser';
import { addRoleForUser } from '../adminrole';
import { createFirstAdminUser } from './common';
import { ADMIN_ROLE, AUTH_TYPE } from '../../constants';

export interface OidcClientConfig {
  server: string;
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  callbackUrl: string;
  discoveryUrl: string;
}

export interface OidcConfig extends OidcClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

let oidcClient: Client;

export const getOidcClient = async (
  redirecturl: string,
  oidcConfig: OidcConfig
): Promise<Client> => {
  if (oidcClient) {
    return oidcClient;
  }

  // OIDCプロバイダーのIssuerを取得
  const oidcIssuer = await Issuer.discover(oidcConfig.discoveryUrl);
  console.log('Discovered issuer %s', oidcIssuer.issuer);

  // クライアントの作成
  oidcClient = new oidcIssuer.Client({
    client_id: oidcConfig.clientId,
    client_secret: oidcConfig.clientSecret,
    redirect_uris: [redirecturl],
    response_types: ['code'],
  });

  return oidcClient;
};

export const genOidcCodeVerifier = async (): Promise<string> => {
  // PKCE用のコードベリファイアを生成
  return generators.codeVerifier();
};

// Oidc認可画面URLを取得
export const getOidcAuthorizationUrl = async (
  client: Client,
  codeVerifier: string
): Promise<string> => {
  // PKCE用のコードベリファイアを生成
  const codeChallenge = generators.codeChallenge(codeVerifier);

  // 認証URLを生成
  const authorizationUrl = client.authorizationUrl({
    scope: 'openid email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  console.log('Authorization URL:', authorizationUrl);

  return authorizationUrl;
};

// Oidcサインイン
export const signinOidc = async (
  client: Client,
  codeVerifier: string,
  req: any,
  // code: string,
  // state: string,
  oidcConfig: OidcConfig
): Promise<string> => {
  const params = client.callbackParams(req);

  const tokenSet = await client.callback(oidcConfig.callbackUrl, params, {
    code_verifier: codeVerifier,
  });

  const claims = tokenSet.claims();

  console.log('Token Set:', tokenSet);
  console.log('ID Token Claims:', claims);

  // Token Set: TokenSet {
  //  access_token: '******',
  //  expires_at: 1736836332,
  //  id_token: '******',
  //  token_type: 'Bearer'
  //}
  // ID Token Claims: {
  //   at_hash: '*************',
  //   aud: '************',
  //   email: '*********@*******',
  //   exp: 1736836332,
  //   iat: 1736834532,
  //   iss: 'https://example.oidc.idp.com',
  //   scope: 'openid email',
  //   sub: '**********'
  // }

  const credentials = formatCredentials(tokenSet);
  if (!credentials.oidcIdToken) {
    debug('signinOidc invalid authentication codeVerifier. %s', codeVerifier);
    throw invalidGoogleOAuth2Token();
  }

  // emailチェック
  const email = claims.email;
  if (!email) {
    debug(
      'signinOidc invalid login claims: %o, idToken: %s',
      claims,
      tokenSet.id_token
    );
    throw invalidGoogleOAuth2Token();
  }
  // emailドメインチェック
  const emailDomain = claims.email!.split('@').pop() as string;
  if (
    oidcConfig.userHostedDomains?.length &&
    !oidcConfig.userHostedDomains.includes(emailDomain)
  ) {
    // 許可されていないメールドメイン
    debug('signinOidc illegal user email: %s', email);
    throw forbidden();
  }

  if (tokenSet.expired()) {
    console.log('Token expired!');
  }

  let adminUser = await findOneByEmail(email);
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, ...credentials },
      AUTH_TYPE.OIDC
    );
    if (firstAdminUser) {
      adminUser = firstAdminUser;
    } else {
      // 初回ログイン時ユーザー作成
      adminUser = await createOne({ email, ...credentials }, AUTH_TYPE.OIDC);
      await addRoleForUser(adminUser.id, ADMIN_ROLE.VIEWER);
    }
  }
  if (adminUser.authType !== AUTH_TYPE.OIDC) {
    throw signinFailed();
  }

  debug('signinOidc Sign jwt for user: %s', adminUser.id);
  return signJwt(adminUser.id);
};

// // アクセストークンの検証
// export const verifyOidcAccessToken = async (
//   userId: string,
//   credentials: OidcCredentials,
//   config: OidcConfig
// ): Promise<boolean> => {

//   oidcClient.refresh(credentials.oidcAccessToken);

//   const client = await getGoogleOAuth2RefreshClient(config, credentials);
//   const accessToken = await client.getAccessToken().catch((e: Error) => {
//     debug('getAccessToken failure. userId: %s, err: %o', userId, e);
//     return e;
//   });

//   // client.getAccessToken内で自動でリフレッシュしてるので、`res`があればリフレッシュ済みとみなす
//   if (accessToken instanceof Error || (accessToken.res?.status ?? 0) >= 400) {
//     debug('AccessToken refresh failure. userId: %s', userId);
//     return false;
//   }

//   if (!accessToken.res) {
//     debug('AccessToken is valid. userId: %s', userId);
//     return true;
//   }

//   debug('AccessToken refresh success! userId: %s', userId);
//   const newCredentials = formatCredentials(
//     accessToken.res.data as Auth.Credentials
//   );
//   await updateOneById(userId, newCredentials);
//   return true;
// };

interface OidcCredentials {
  oidcAccessToken: string | null;
  oidcExpiryDate: number | null;
  oidcIdToken: string | null;
  oidcTokenType: string | null;
}

const formatCredentials = (credentials: TokenSet): OidcCredentials => {
  return {
    oidcAccessToken: credentials.access_token ?? null,
    oidcExpiryDate: credentials.expires_at ?? null,
    oidcIdToken: credentials.id_token ?? null,
    oidcTokenType: credentials.token_type ?? null,
  };
};
