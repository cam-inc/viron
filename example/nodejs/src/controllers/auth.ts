import {
  domainsAuth,
  genAuthorizationCookie,
  genOAuthStateCookie,
  genOidcStateCookie,
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
  const token = await domainsAuth.signinEmail(email, password);
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, { maxAge: ctx.config.auth.jwt.expirationSec })
  );
  context.res.status(204).end();
};

// OIDCの認証画面へリダイレクト
export const oidcAuthorization = async (
  context: RouteContext
): Promise<void> => {
  const { redirectUri } = context.params.query;
  const client = await domainsAuth.getOidcClient(
    redirectUri,
    ctx.config.auth.oidc
  );
  const codeVerifier = await domainsAuth.genOidcCodeVerifier();

  const authorizationUrl = await domainsAuth.getOidcAuthorizationUrl(
    client,
    codeVerifier
  );

  console.log('codeVerifier:', codeVerifier);

  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genOidcStateCookie(codeVerifier)
  );
  context.res.setHeader(HTTP_HEADER.LOCATION, authorizationUrl);
  context.res.status(301).end();
};

// OIDCのコールバック
export const oidcCallback = async (context: RouteContext): Promise<void> => {
  const cookieState = context.req.cookies[COOKIE_KEY.OIDC_STATE];
  // const { code } = context.params.query;

  // if (!cookieState || !state || cookieState !== state) {
  //   throw mismatchState();
  // }

  console.log('cookieState:', cookieState);

  const client = await domainsAuth.getOidcClient('', ctx.config.auth.oidc);
  const token = await domainsAuth.signinOidc(
    client,
    cookieState!,
    context.req,
    ctx.config.auth.oidc
  );
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, {
      maxAge: ctx.config.auth.jwt.expirationSec,
    })
  );
  context.res.setHeader(
    HTTP_HEADER.LOCATION,
    'https://viron.work:8000/ja/endpoints/example/'
  );
  context.res.status(301).end();
};

// GoogleOAuth2の認可画面へリダイレクト
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

  context.res.setHeader(HTTP_HEADER.SET_COOKIE, genOAuthStateCookie(state));
  context.res.setHeader(HTTP_HEADER.LOCATION, authorizationUrl);
  context.res.status(301).end();
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
    code,
    redirectUri,
    ctx.config.auth.googleOAuth2
  );
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, {
      maxAge: ctx.config.auth.jwt.expirationSec,
    })
  );
  context.res.status(204).end();
};
