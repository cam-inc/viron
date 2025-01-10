import { Issuer, generators, Client } from 'openid-client';
import { v4 as uuidv4 } from 'uuid';

export interface OidcClientConfig {
  server: string;
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  callbackUrl: string;
}

export interface OidcConfig extends OidcClientConfig {
  additionalScopes?: string[];
  userHostedDomains?: string[];
}

let oidcClient: Client;
let codeVerifier: string;

export const getOidcClient = async (
  redirecturl: string,
  oidcConfig: OidcConfig
): Promise<Client> => {
  if (oidcClient) {
    return oidcClient;
  }

  // OIDCプロバイダーのIssuerを取得
  const oidcIssuer = await Issuer.discover(
    'https://federation.perman.jp/.well-known/openid-configuration'
  );
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
  if (codeVerifier) {
    return codeVerifier;
  }
  // PKCE用のコードベリファイアを生成
  codeVerifier = generators.codeVerifier();
  return codeVerifier;
};

// Oidc認可画面URLを取得
export const getOidcAuthorizationUrl = async (
  client: Client,
  codeVerifier: string
): Promise<string> => {
  // OIDCプロバイダーのIssuerを取得
  const oidcIssuer = await Issuer.discover(
    'https://example.com/.well-known/openid-configuration'
  );
  console.log('Discovered issuer %s', oidcIssuer.issuer);

  // PKCE用のコードベリファイアを生成
  const codeChallenge = generators.codeChallenge(codeVerifier);

  // 認証URLを生成
  const authorizationUrl = client.authorizationUrl({
    scope: 'openid profile email',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  console.log('Authorization URL:', authorizationUrl);

  return authorizationUrl;
};

// ステートを生成
export const genOidcState = (): string => uuidv4();

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

  console.log('Token Set:', tokenSet);
  console.log('ID Token Claims:', tokenSet.claims());

  if (tokenSet.expired()) {
    console.log('Token expired!');
  }

  if (tokenSet.id_token) {
    return tokenSet.id_token;
  }

  throw new Error('No ID Token found in the Token Set');
};
