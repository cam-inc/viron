# Viron standard library for node.js server

This library covers all the functions needed to build a viron server, and provides them as simple functions.
It is not dependent on any particular framework and can be used by anyone.

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
Only three actions are allowed: `READ, WRITE, ALL, and DENY`.
These correspond to HTTP request methods.
POST, PUT methods can only action on resources for which WRITE is allowed.
GET method can action on resources for READ or WRITE actions are allowed.
Of course, DENY does not allow any requests.

You can specify the resource in your specifications `.info['x-pages'][].contents[].resourceId`.
Also, all APIs related to the `Operation` corresponding to the `resourceId` are determined to be the same resource.

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

### AdminUser

`domainsAdminUser` provides CRUD for admin users.
It manages credentials such as salt and hashed passwords in the case of password authentication, and access tokens and refresh tokens in the case of Google OAuth.

### AdminAccount

`domainsAdminAccount` is a function to manage the logged-in user yourself.
You can use it to change your own password.

### AuditLog

It provides several functions for recording the audit logs of viron servers.
Besides `createOne()` for recording the audit log, there is the `isSkip()` function to determine whether to skip recording or not.
By writing `x-skip-auditlog: true` in the `Operation` of your specifications, `isSkip()` will return `true`.

### OpenAPI

`domainsOas` provides functions for loading specifications and various other functions using your specifications.

The `get()` method is an important function to get a specification that optimized by a role.
The API registered with the viron endpoint should return the entire specifications.
In this library, each function is provided as a different yaml file, but we expect them to be merged on your server.
`get()` method is a function that removes inaccessible pages from the merged specification `.info['x-page']` and returns a user-optimized specification.
This way, the inaccessible pages will not be displayed in viron.

## Basic Commands

```sh
# To check build.
$ npm run build --workspace=@viron/lib

# To test.
$ npm test --workspace=@viron/lib
```
