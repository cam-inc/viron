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
- [x] OpenAPI

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

### AuthConfig

When the server fails to validate the JWT and returns Unauthorized(HTTP status 401), viron calls the API that get the authentication method. (`GET:/viron/authconfigs` in this library.)
`domainsAuthConfig` provides only a simple function to form the response of the API.

### AdminRole

For the management of admin user roles, we use `casbin` RBAC model.
Assign resources to roles and allow them to actions.
Only three actions are allowed: `READ, WRITE, and DENY`.
These correspond to HTTP request methods. POST, PUT, and DELETE methods can only action on resources for which WRITE is allowed. GET method can action on resources for READ or WRITE actions are allowed.
Of course, DENY does not allow any requests.

Assign roles to admin users and allow them to perform actions.

#### Special Roles

##### super

`super` is the role with the greatest privileges on the system.
It has full access to all resources regardless of the permission settings.
Use caution when granting `super` privileges.

##### viewer

The `viewer` is a reference-only user that is created automatically.
It has `READ` privileges for all resources present at the time of creation, but privileges for resources added thereafter must be maintained by the system administrator, just like any other role.

This is the initial role for users who have logged in through OAuth.

## Basic Commands

```sh
# To check build.
$ npm run build --workspace=@viron/lib

# To test.
$ npm test --workspace=@viron/lib
```
