import {
  domainsAuth,
  genAuthorizationCookie,
  COOKIE_KEY,
  HTTP_HEADER,
} from '@viron/lib';
import { RouteContext } from '../application';
import { ctx } from '../context';

// サインアウト
export const signout = async (context: RouteContext): Promise<void> => {
  const token = context.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
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
