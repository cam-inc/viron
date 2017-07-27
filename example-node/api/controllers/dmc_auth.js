const reduce = require('mout/object/reduce');

const helperGoogleOAuth = require('../helpers/googleoauth');
const helperJwt = require('../helpers/jwt');
const helperPassword = require('../helpers/password');
const shared = require('../../shared');

const getRoles = roleId => {
  if (roleId === shared.context.getSuperRole()) {
    return new Promise(resolve => {
      resolve({
        get: '*',
        post: '*',
        put: '*',
        delete: '*',
        patch: '*',
      });
    });
  }

  const AdminRoles = shared.context.getStoreMain().models.AdminRoles;
  AdminRoles.findAll()
    .then(roles => {
      return reduce(roles, (ret, role) => {
        const method = ret.method.toLowerCase();
        ret[method] = ret[method] || [];
        ret[method].push(role.resource);
        return ret;
      }, {});
    })
  ;
};

/**
 * POST: /signin
 */
const signin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const AdminUsers = shared.context.getStoreMain().models.AdminUsers;

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
            return Promise.reject(new Error('Not Found.'));
          }
        })
        .then(() => {
          // 1人目の場合はスーパーユーザーとして登録する
          // - パスワードソルトの生成
          return helperPassword.genSalt();
        })
        .then(salt => {
          // - パスワードのハッシュ化
          return helperPassword.genHash(password, salt)
            .then(password => {
              return {password, salt};
            })
          ;
        })
        .then(data => {
          data.email = email;
          data.role_id = shared.context.getSuperRole();
          return AdminUsers.create(data);
        })
      ;
    })
    .then(adminUser => {
      // パスワード検証
      return helperPassword.verify(password, adminUser.password, adminUser.salt)
        .then(result => {
          if (!result) {
            return Promise.reject(new Error('Unauthorized'));
          }
          return adminUser;
        })
      ;
    })
    .then(adminUser => {
      // ロールを取得
      return getRoles(adminUser.role_id);
    })
    .then(roles => {
      // JWTを生成
      const claims = {
        sub: email,
        roles: roles,
      };
      return helperJwt.sign(claims, shared.context.getConfigAuthJwt());
    })
    .then(token => {
      const conf = shared.context.getConfigAuthJwt();
      res.setHeader(conf.header_key, `Bearer ${token}`);
      res.end();
    })
  ;
};

/**
 * POST: /signout
 */
const signout = (req, res) => {
  res.end();
};

/**
 * GET: /googlesignin
 */
const googleSignin = (req, res) => {
  const conf = shared.context.getConfigGoogleOAuth();
  // Googleの認証画面にリダイレクト
  const authUrl = helperGoogleOAuth.genAuthUrl(conf);
  return res.redirect(authUrl);
};

/**
 * GET: /googleoauth2callback
 */
const googleOAuth2Callback = (req, res) => {
  const redirectUrl = req.query.state;

  const conf = shared.context.getConfigGoogleOAuth();
  // アクセストークンを取得
  helperGoogleOAuth.getToken(req.query.code, conf)
    .then(token => {
      // メールアドレスを検証
      return helperGoogleOAuth.allowMailDomain(token, conf)
        .then(email => {
          if (!email) {
            return Promise.reject(new Error('Forbidden'));
          }
          return {token, email};
        })
      ;
    })
    .then(data => {
      const AdminUsers = shared.context.getStoreMain().models.AdminUsers;
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
                return Promise.reject(new Error('Not Found.'));
              }
              // 1人目の場合はスーパーユーザーとして登録する
              const roleId = shared.context.getSuperRole();
              return AdminUsers.create({email: data.email, role_id: roleId});
            })
          ;
        })
        .then(adminUser => {
          // ロールを取得
          return getRoles(adminUser.role_id);
        })
        .then(roles => {
          // JWTを生成
          const claims = {
            sub: data.email,
            roles: roles,
            googleOAuthToken: data.token,
          };
          return helperJwt.sign(claims, shared.context.getConfigAuthJwt());
        })
      ;
    })
    .then(token => {
      const conf = shared.context.getConfigAuthJwt();
      const authToken = `Bearer ${token}`;
      res.setHeader(conf.header_key, authToken);
      res.redirect(`${redirectUrl}?token=${authToken}`);
    })
    .catch(err => {
      console.log(err);
      res.redirect(redirectUrl);
    })
  ;
};

module.exports = {
  'dmc_auth#signin': signin,
  'dmc_auth#signout': signout,
  'dmc_auth#googlesignin': googleSignin,
  'dmc_auth#googleoauth2callback': googleOAuth2Callback,
};
