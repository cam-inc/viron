module.exports = helper => {
  const config = {
    host: `${process.env.VIRON_HOSTNAME}:3000`,
    // vironlibのadmin_roleが使用するユーザー作成時の初期ロール名
    default_role: 'viewer',
    // vironlibのadmin_roleが使用するスーパーユーザーのロール名
    super_role: 'super',

    // GoogleOAuth認証用
    google_oauth: {
    },

    // vironlibのCORS対応
    acl: {
      allow_headers: 'X-Requested-With, Origin, Content-Type, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
      expose_headers: 'X-Requested-With, Origin, Content-Type, Content-Disposition, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
    },

    // DataStore
    stores: {
      main: {
        type: 'mysql',
        config: {
          database: 'viron_local', // The name of the database
          dialect: 'mysql', // The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql. 'mysql'|'sqlite'|'postgres'|'mssql'
          timezone: '+09:00', // The timezone used when converting a date from the database into a JavaScript date. The timezone is also used to SET TIMEZONE when connecting to the server, to ensure that the result of NOW, CURRENT_TIMESTAMP and other time related functions have in the right timezone. For best cross platform performance use the format +/-HH:MM. Will also accept string versions of timezones used by moment.js (e.g. 'America/Los_Angeles'); this is useful to capture daylight savings time changes.
          logging: helper.infoLog, // {Function} A function that gets executed every time Sequelize would log something.
          benchmark: false, // Pass query execution time in milliseconds as second argument to logging function (options.logging).
          replication: { // Use read / write replication. To enable replication, pass an object, with two properties, read and write. Write should be an object (a single server for handling writes), and read an array of object (several servers to handle reads). Each read/write server can have the following properties: `host`, `port`, `username`, `password`, `database`
            write: {
              host: 'viron.dev', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: process.env.MYSQL_USER_NAME, // The username which is used to authenticate against the database.
              password: process.env.MYSQL_USER_PASSWORD, // The password which is used to authenticate against the database.
              pool: { // Should sequelize use a connection pool. Default is true
                max: 10, // Maximum number of connection in pool. Default is 5
                min: 5, // Minimum number of connection in pool. Default is 0
                idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
              },
            },
            read: [{
              host: 'viron.dev', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: process.env.MYSQL_USER_NAME, // The username which is used to authenticate against the database.
              password: process.env.MYSQL_USER_PASSWORD, // The password which is used to authenticate against the database.
              pool: { // Should sequelize use a connection pool. Default is true
                max: 10, // Maximum number of connection in pool. Default is 5
                min: 5, // Minimum number of connection in pool. Default is 0
                idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
              },
            }],
          },
          retry: { // Set of flags that control when a query is automatically retried.
            max: 3, // How many times a failing query is automatically retried.  Set to 0 to disable retrying on SQL_BUSY error.
          },
        },
      },
    },

    // JWT認証
    auth_jwt: {
      token_expire: 1 * 24 * 60 * 60 * 1000, // 1日
      algorithm: 'RS512',
      claims: {
        iss: 'viron-example-email',
        aud: 'viron.local',
      },
      rsa_private_key: process.env.AUTH_JWT_PRIVATE_KEY,
      rsa_public_key: process.env.AUTH_JWT_PUBLIC_KEY,
    },

    ssl: {
      use: true,
      key: process.env.SSL_PRIVATE_KEY,
      cert: process.env.SSL_CERTIFICATE,
    },
  };
  return config;
};
