const reduce = require('mout/object/reduce');

const helperGoogle = require('./google').helper;
const helperJwt = require('./jwt').helper;
const helperEMail = require('./email').helper;

const constant = require('../constant');
const errors = require('../errors');

const getRoles = (AdminRoles, roleId) => {
  if (roleId === constant.DMC_SUPER_ROLE) {
    return new Promise(resolve => {
      resolve({
        get: ['*'],
        post: ['*'],
        put: ['*'],
        delete: ['*'],
        patch: ['*'],
      });
    });
  }

  return AdminRoles.findAll({where: {role_id: roleId}})
    .then(roles => {
      return reduce(roles, (ret, role) => {
        const method = role.method.toLowerCase();
        ret[method] = ret[method] || [];
        ret[method].push(role.resource);
        return ret;
      }, {});
    })
  ;
};

/**
 * Controller : Sing In
 * HTTP Method : POST
 * PATH : /signin
 *
 * @param AdminUsers Sequelize.model
 * @param superRole
 * @param configAuthJwt
 * @returns {function(*, *, *)}
 */
const registerSignIn = (AdminUsers, AdminRoles, superRole, configAuthJwt) => {
  return (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // メアドでユーザ検索
    AdminUsers.findOne({where: {email}})
      .then(adminUser => {
        if (adminUser) {
          return adminUser;
        }

        // 1人目かどうか
        return AdminUsers.count()
          .then(cnt => {
            if (cnt > 0) {
              // 1人目じゃなければエラー（管理者がユーザー作成してあげる）
              return Promise.reject(errors.frontend.AdminUserNotFound());
            }
          })
          .then(() => {
            // 1人目の場合はスーパーユーザーとして登録する
            // - パスワードソルトの生成
            return helperEMail.genSalt();
          })
          .then(salt => {
            // - パスワードのハッシュ化
            return helperEMail.genHash(password, salt)
              .then(password => {
                return {password, salt};
              })
            ;
          })
          .then(data => {
            data.email = email;
            data.role_id = superRole;
            return AdminUsers.create(data);
          })
        ;
      })
      .then(adminUser => {
        // パスワード検証
        return helperEMail.verify(password, adminUser.password, adminUser.salt)
          .then(result => {
            if (!result) {
              return Promise.reject(errors.frontend.SigninFailed());
            }
            return adminUser;
          })
        ;
      })
      .then(adminUser => {
        // ロールを取得
        return getRoles(AdminRoles, adminUser.role_id);
      })
      .then(roles => {
        // JWTを生成
        const claims = {
          sub: email,
          roles: roles,
        };
        return helperJwt.sign(claims, configAuthJwt);
      })
      .then(token => {
        const conf = configAuthJwt;
        res.setHeader(conf.header_key, `Bearer ${token}`);
        res.end();
      })
    ;
  };
};

/**
 * Controller : Sing Out
 * HTTP Method : POST
 * PATH : /signout
 *
 * @returns {function(*, *, *)}
 */
const registerSignOut = () => {
  return (req, res) => {
    res.end();
  };
};

/**
 * Controller : Sing In (Google)
 * HTTP Method : POST
 * PATH : /googlesignin
 *
 * @param configGoogleOAuth
 * @returns {function(*, *, *)}
 */
const registerGoogleSignIn = configGoogleOAuth => {
  return (req, res) => {
    // Googleの認証画面にリダイレクト
    const authUrl = helperGoogle.genAuthUrl(configGoogleOAuth);
    return res.redirect(authUrl); // 301
  };
};

/**
 * GET: /googleoauth2callback
 */
const registerGoogleOAuth2Callback = (AdminUsers, AdminRoles, configGoogleOAuth, configAuthJwt) => {
  return (req, res) => {
    const redirectUrl = req.query.state;

    // アクセストークンを取得
    helperGoogle.getToken(req.query.code, configGoogleOAuth)
      .then(token => {
        // メールアドレスを検証
        return helperGoogle.allowMailDomain(token, configGoogleOAuth)
          .then(email => {
            if (!email) {
              return Promise.reject(errors.frontend.Forbidden());
            }
            return {token, email};
          })
        ;
      })
      .then(data => {
        // メアドでユーザ検索
        return AdminUsers.findOne({where: {email: data.email}})
          .then(adminUser => {
            if (adminUser) {
              return adminUser;
            }

            // 1人目かどうか
            return AdminUsers.count()
              .then(cnt => {
                if (cnt > 0) {
                  // 1人目じゃなければエラー（管理者がユーザー作成してあげる）
                  return Promise.reject(errors.frontend.AdminUserNotFound());
                }
                // 1人目の場合はスーパーユーザーとして登録する
                return AdminUsers.create({email: data.email, role_id: constant.DMC_SUPER_ROLE});
              })
            ;
          })
          .then(adminUser => {
            // ロールを取得
            return getRoles(AdminRoles, adminUser.role_id);
          })
          .then(roles => {
            // JWTを生成
            const claims = {
              sub: data.email,
              roles: roles,
              googleOAuthToken: data.token,
            };
            return helperJwt.sign(claims, configAuthJwt);
          })
        ;
      })
      .then(token => {
        const authToken = `Bearer ${token}`;
        res.setHeader(configAuthJwt.header_key, authToken);
        res.redirect(`${redirectUrl}?token=${authToken}`);
      })
      .catch(err => {
        console.log(err);
        res.redirect(redirectUrl);
      })
    ;
  };
};

module.exports = {
  registerSignIn: registerSignIn,
  registerSignOut: registerSignOut,
  registerGoogleSignIn: registerGoogleSignIn,
  registerGoogleOAuth2Callback: registerGoogleOAuth2Callback,
};
