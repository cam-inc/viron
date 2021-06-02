import { domainsAuth, HTTP_HEADER } from '@viron/lib';
import { RouteContext } from '.';

// サインアウト
export const signout = async (context: RouteContext): Promise<void> => {
  const token = context.params.header[HTTP_HEADER.AUTHORIZATION];
  await domainsAuth.signout(token);
  context.res.status(204).end();
};

// Emailサインイン
export const signinEmail = async (context: RouteContext): Promise<void> => {
  const { email, password } = context.requestBody;
  const token = await domainsAuth.signinEmail(email, password);
  context.res.setHeader(HTTP_HEADER.AUTHORIZATION, token);
  context.res.status(204).end();
};
