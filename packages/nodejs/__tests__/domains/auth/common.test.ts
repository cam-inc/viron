import {
  createFirstAdminUser,
  createViewer,
  createAdminUser,
  formatTokenSetToSsoTokens,
  formatCredentialsToSsoTokens,
} from '../../../src/domains/auth/common';
import { ADMIN_ROLE, AUTH_TYPE } from '../../../src/constants';
import { Auth } from 'googleapis';
import sinon from 'sinon';
import { TokenSet } from 'openid-client';

import * as domainsAdminUser from '../../../src/domains/adminuser';
import * as domainsAdminUserSsoToken from '../../../src/domains/adminuserssotoken';
import * as domainsAdminRole from '../../../src/domains/adminrole';

const mockCreateOneAdminUser = sinon.stub(domainsAdminUser, 'createOne');
const mockCount = sinon.stub(domainsAdminUser, 'count');
const mockCreateOneSsoToken = sinon.stub(domainsAdminUserSsoToken, 'createOne');
const mockAddRoleForUser = sinon.stub(domainsAdminRole, 'addRoleForUser');

describe('Auth Common Functions', () => {
  beforeEach(() => {
    sinon.reset();
  });

  describe('createFirstAdminUser', () => {
    it('should create the first admin user if none exists', async () => {
      mockCount.resolves(0);
      mockCreateOneAdminUser.resolves({
        id: '1',
        email: 'admin@example.com',
      } as domainsAdminUser.AdminUserWithCredential);
      mockCreateOneSsoToken.resolves(
        {} as domainsAdminUserSsoToken.AdminUserSsoToken
      );
      mockAddRoleForUser.resolves(true);

      const adminUserPayload: domainsAdminUser.AdminUserCreatePayload = {
        email: 'admin@example.com',
        password: 'password',
      };
      const adminUserSsoTokenPayload: domainsAdminUserSsoToken.AdminUserSsoTokenCreatePayload =
        {
          idToken: 'token',
          authType: AUTH_TYPE.OIDC,
          userId: '1',
          provider: 'provider',
          clientId: 'clientId',
          accessToken: 'accessToken',
          expiryDate: 1234567890,
          refreshToken: 'refreshToken',
          tokenType: 'tokenType',
        };

      const result = await createFirstAdminUser(
        AUTH_TYPE.OIDC,
        adminUserPayload,
        adminUserSsoTokenPayload
      );

      expect(result).toEqual({ id: '1', email: 'admin@example.com' });
      expect(mockCount.called).toBe(true);
      expect(mockCreateOneAdminUser.calledWith(true, adminUserPayload)).toBe(
        true
      );
      //   expect(mockCreateOneSsoToken.calledWith(adminUserPayload)).toBe(true);
      expect(mockAddRoleForUser.calledWith('1', ADMIN_ROLE.SUPER)).toBe(true);
    });

    it('should not create the first admin user if one already exists', async () => {
      mockCount.resolves(1);

      const adminUserPayload: domainsAdminUser.AdminUserCreatePayload = {
        email: 'admin@example.com',
        password: 'password',
      };
      const adminUserSsoTokenPayload: domainsAdminUserSsoToken.AdminUserSsoTokenCreatePayload =
        {
          idToken: 'token',
          authType: AUTH_TYPE.OIDC,
          userId: '1',
          provider: 'provider',
          clientId: 'clientId',
          accessToken: 'accessToken',
          expiryDate: 1234567890,
          refreshToken: 'refreshToken',
          tokenType: 'tokenType',
        };

      const result = await createFirstAdminUser(
        AUTH_TYPE.OIDC,
        adminUserPayload,
        adminUserSsoTokenPayload
      );

      expect(result).toBeNull();
      expect(mockCount.called).toBe(true);
      expect(mockCreateOneAdminUser.called).toBe(false);
      expect(mockCreateOneSsoToken.called).toBe(false);
      expect(mockAddRoleForUser.called).toBe(false);
    });
  });

  describe('createViewer', () => {
    it('should create a viewer admin user', async () => {
      mockCreateOneAdminUser.resolves({
        id: '2',
        email: 'viewer@example.com',
      } as domainsAdminUser.AdminUserWithCredential);
      mockCreateOneSsoToken.resolves(
        {} as domainsAdminUserSsoToken.AdminUserSsoToken
      );
      mockAddRoleForUser.resolves(true);

      const adminUserPayload: domainsAdminUser.AdminUserCreatePayload = {
        email: 'viewer@example.com',
        password: 'password',
      };
      const adminUserSsoTokenPayload: domainsAdminUserSsoToken.AdminUserSsoTokenCreatePayload =
        {
          idToken: 'token',
          authType: AUTH_TYPE.OIDC,
          userId: '2',
          provider: 'provider',
          clientId: 'clientId',
          accessToken: 'accessToken',
          expiryDate: 1234567890,
          refreshToken: 'refreshToken',
          tokenType: 'tokenType',
        };

      const result = await createViewer(
        AUTH_TYPE.OIDC,
        adminUserPayload,
        adminUserSsoTokenPayload
      );

      expect(result).toEqual({ id: '2', email: 'viewer@example.com' });
      expect(mockCreateOneAdminUser.calledWith(true, adminUserPayload)).toBe(
        true
      );
      //   expect(mockCreateOneSsoToken.calledWith({ token: 'token', userId: '2' })).toBe(true);
      expect(mockAddRoleForUser.calledWith('2', ADMIN_ROLE.VIEWER)).toBe(true);
    });
  });

  describe('createAdminUser', () => {
    it('should create an admin user with the specified role', async () => {
      mockCreateOneAdminUser.resolves({
        id: '3',
        email: 'admin@example.com',
      } as domainsAdminUser.AdminUserWithCredential);
      mockCreateOneSsoToken.resolves(
        {} as domainsAdminUserSsoToken.AdminUserSsoToken
      );
      mockAddRoleForUser.resolves(true);

      const adminUserPayload: domainsAdminUser.AdminUserCreatePayload = {
        email: 'admin@example.com',
        password: 'password',
      };
      const adminUserSsoTokenPayload: domainsAdminUserSsoToken.AdminUserSsoTokenCreatePayload =
        {
          idToken: 'token',
          authType: AUTH_TYPE.OIDC,
          userId: '3',
          provider: 'provider',
          clientId: 'clientId',
          accessToken: 'accessToken',
          expiryDate: 1234567890,
          refreshToken: 'refreshToken',
          tokenType: 'tokenType',
        };

      const result = await createAdminUser(
        AUTH_TYPE.OIDC,
        adminUserPayload,
        ADMIN_ROLE.SUPER,
        adminUserSsoTokenPayload
      );

      expect(result).toEqual({ id: '3', email: 'admin@example.com' });
      expect(mockCreateOneAdminUser.calledWith(true, adminUserPayload)).toBe(
        true
      );
      //   expect(mockCreateOneSsoToken.calledWith({ token: 'token', userId: '3' })).toBe(true);
      expect(mockAddRoleForUser.calledWith('3', ADMIN_ROLE.SUPER)).toBe(true);
    });
  });

  describe('formatTokenSetToSsoTokens', () => {
    it('should format TokenSet to SsoTokens', () => {
      const tokenSet = {
        access_token: 'access_token',
        expires_at: 1234567890,
        id_token: 'id_token',
        refresh_token: 'refresh_token',
        token_type: 'token_type',
      } as TokenSet;

      const result = formatTokenSetToSsoTokens(tokenSet);

      expect(result).toEqual({
        accessToken: 'access_token',
        expiryDate: 1234567890,
        idToken: 'id_token',
        refreshToken: 'refresh_token',
        tokenType: 'token_type',
      });
    });
    it('should handle missing properties', () => {
      const tokenSet = {} as TokenSet;
      const result = formatTokenSetToSsoTokens(tokenSet);
      expect(result).toEqual({
        accessToken: '',
        expiryDate: 0,
        idToken: '',
        refreshToken: null,
        tokenType: '',
      });
    });
  });

  describe('formatCredentialsToSsoTokens', () => {
    it('should format Credentials to SsoTokens', () => {
      const credentials: Auth.Credentials = {
        access_token: 'access_token',
        expiry_date: 1234567890,
        id_token: 'id_token',
        refresh_token: 'refresh_token',
        token_type: 'token_type',
      };

      const result = formatCredentialsToSsoTokens(credentials);

      expect(result).toEqual({
        accessToken: 'access_token',
        expiryDate: 1234567890,
        idToken: 'id_token',
        refreshToken: 'refresh_token',
        tokenType: 'token_type',
      });
    });
    it('should handle missing properties', () => {
      const credentials: Auth.Credentials = {};
      const result = formatCredentialsToSsoTokens(credentials);
      expect(result).toEqual({
        accessToken: '',
        expiryDate: 0,
        idToken: '',
        refreshToken: '',
        tokenType: '',
      });
    });
  });
});
