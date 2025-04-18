import {
  domainsAuth,
  genAuthorizationCookie,
  genOAuthStateCookie,
  genOidcStateCookie,
  genOidcCodeVerifierCookie,
  mismatchState,
  COOKIE_KEY,
  HTTP_HEADER,
} from '@viron/lib';
import { RouteContext } from '../application';
import { ctx } from '../context';

// サインアウト
export const signout = async (context: RouteContext): Promise<void> => {
  const token = context.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  context.origRes.clearCookie(COOKIE_KEY.VIRON_AUTHORIZATION);
  await domainsAuth.signout(token);
  context.res.status(204).end();
};

// Emailサインイン
export const signinEmail = async (context: RouteContext): Promise<void> => {
  const { email, password } = context.requestBody;
  const token = await domainsAuth.signinEmail(context.req, email, password);
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, { maxAge: ctx.config.auth.jwt.expirationSec })
  );
  context.res.status(204).end();
};

// OIDCの認証画面 URL を返却
export const oidcAuthorization = async (
  context: RouteContext
): Promise<void> => {
  const { redirectUri } = context.params.query;
  const state = domainsAuth.genState();
  const client = await domainsAuth.genOidcClient(
    ctx.config.auth.oidc,
    redirectUri
  );

  // PKCE用のCodeVerifierを生成
  const codeVerifier = await domainsAuth.genOidcCodeVerifier();

  // OIDC認証画面URLを取得
  const authorizationUrl = await domainsAuth.getOidcAuthorizationUrl(
    ctx.config.auth.oidc,
    client,
    codeVerifier,
    state
  );

  // CookieにOIDCのStateとPKCE用のCodeVerifierをセット
  const cookies = [
    genOidcStateCookie(state, { partitioned: true }),
    genOidcCodeVerifierCookie(codeVerifier, { partitioned: true }),
  ];

  context.res
    .status(200)
    .set(HTTP_HEADER.SET_COOKIE, cookies)
    .set(HTTP_HEADER.LOCATION, authorizationUrl)
    .json({
      authorizationUrl,
    });
};

// OIDCのコールバック
export const oidcCallback = async (context: RouteContext): Promise<void> => {
  const codeVerifier = context.req.cookies[COOKIE_KEY.OIDC_CODE_VERIFIER];
  const cookieState = context.req.cookies[COOKIE_KEY.OIDC_STATE];
  const { state, redirectUri } = context.requestBody;

  if (!codeVerifier || !cookieState || !state || cookieState !== state) {
    throw mismatchState();
  }

  // OIDC Clientを取得
  const client = await domainsAuth.genOidcClient(
    ctx.config.auth.oidc,
    redirectUri
  );
  const params = client.callbackParams(context.req);
  const token = await domainsAuth.signinOidc(
    context.req,
    client,
    codeVerifier,
    redirectUri,
    params,
    ctx.config.auth.oidc,
    ctx.config.auth.multipleAuthUser
  );
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, {
      maxAge: ctx.config.auth.jwt.expirationSec,
      partitioned: true,
    })
  );
  context.origRes.clearCookie(COOKIE_KEY.OIDC_STATE);
  context.origRes.clearCookie(COOKIE_KEY.OIDC_CODE_VERIFIER);

  context.res.status(204).end();
};

// GoogleOAuth2の認可画面を返却
export const oauth2GoogleAuthorization = async (
  context: RouteContext
): Promise<void> => {
  const { redirectUri } = context.params.query;
  const state = domainsAuth.genState();

  const authorizationUrl = domainsAuth.getGoogleOAuth2AuthorizationUrl(
    redirectUri,
    state,
    ctx.config.auth.googleOAuth2
  );
  context.res
    .status(200)
    .set(
      HTTP_HEADER.SET_COOKIE,
      genOAuthStateCookie(state, { partitioned: true })
    )
    .json({
      authorizationUrl,
    });
};

// GoogleOAuth2のコールバック
export const oauth2GoogleCallback = async (
  context: RouteContext
): Promise<void> => {
  const cookieState = context.req.cookies[COOKIE_KEY.OAUTH2_STATE];
  const { code, state, redirectUri } = context.requestBody;

  if (!cookieState || !state || cookieState !== state) {
    throw mismatchState();
  }

  const token = await domainsAuth.signinGoogleOAuth2(
    context.req,
    code,
    redirectUri,
    ctx.config.auth.googleOAuth2,
    ctx.config.auth.multipleAuthUser
  );
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, {
      maxAge: ctx.config.auth.jwt.expirationSec,
      partitioned: true,
    })
  );
  context.res.status(204).end();
};
