# Viron standard library for node.js server

## Features

- [x] Authentication
  - [x] Email/Password
  - [x] GoogleOAuth2
  - [x] Signout
- [x] AuthConfig
- [x] AdminRole
- [x] AdminUser
- [x] AdminAccount
- [x] AuditLog
- [x] OpenAPISpecifiation

### Authentication

It supports its own authentication by email and password, and authentication using GoogleOAuth2.
In both cases, the signed-up user is managed as admin-user and authenticated to the Viron server using JWT.
All features are available from `domainsAuth`.

#### Email/Password

Since this library does not have a function to check the validity of e-mails, new user registration must be done by the system administrator.
Please set an initial password and tell the users to change the password at the first login.

Passwords are hashed and stored using SHA512 and PBKDF2.

#### GoogleOAuth2

If you want to use GoogleOAuth2, you first need to create an OAuth2.0 client in GoogleCloudPlatform.
Set the client ID and client secret provided there to `GoogleOAuthConfig`.

If your organization is using GSuite, you can make it more secure by specifying `userHostedDomains`.

#### Signout

When you sign out, the JWT will be saved in `revoked-tokens`.
Next when validating the JWT, check to see if the user has already signed out.

## Basic Commands

```sh
# To check build.
$ npm run build --workspace=@viron/lib

# To test.
$ npm test --workspace=@viron/lib
```
