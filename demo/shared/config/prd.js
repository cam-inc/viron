module.exports = helper => {
  const config = {
    host: `${process.env.VIRON_HOSTNAME}:443`,
    // vironlibのadmin_roleが使用するユーザー作成時の初期ロール名
    default_role: 'visiter',
    // vironlibのadmin_roleが使用するスーパーユーザーのロール名
    super_role: 'super',

    // GoogleOAuth認証用
    google_oauth: {
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_url: `https://${process.env.VIRON_HOSTNAME}/googleoauth2callback`,
      //state_url: 'https://cam-inc.github.io/viron/#/',
      allow_email_domains: [
        // ここに書いたドメインが利用可能
        'gmail.com',
        'camobile.com',
      ],
    },

    // vironlibのCORS対応
    acl: {
      allow_origin: 'https://cam-inc.github.io',
      allow_headers: 'X-Requested-With, Origin, Content-Type, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
      expose_headers: 'X-Requested-With, Origin, Content-Type, Content-Disposition, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
    },

    // DataStore
    stores: {
      main: {
        type: 'mysql',
        config: {
          database: 'viron_prd', // The name of the database
          dialect: 'mysql', // The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql. 'mysql'|'sqlite'|'postgres'|'mssql'
          // dialectModulePath: null, // {String} If specified, load the dialect library from this path. For example, if you want to use pg.js instead of pg when connecting to a pg database, you should specify 'pg.js' here
          // dialectOptions: null, // {Object} An object of additional options, which are passed directly to the connection library
          // storage: null, // {String} Only used by sqlite. Defaults to ':memory:'
          // protocol:'tcp', // The protocol of the relational database.
          // define: {}, // {Onject} Default options for model definitions. See sequelize.define for options
          // query: {}, // Default options for sequelize.query
          // set: {}, // Default options for sequelize.set
          // sync: {}, // Default options for sequelize.sync
          timezone: '+09:00', // The timezone used when converting a date from the database into a JavaScript date. The timezone is also used to SET TIMEZONE when connecting to the server, to ensure that the result of NOW, CURRENT_TIMESTAMP and other time related functions have in the right timezone. For best cross platform performance use the format +/-HH:MM. Will also accept string versions of timezones used by moment.js (e.g. 'America/Los_Angeles'); this is useful to capture daylight savings time changes.
          logging: helper.infoLog, // {Function} A function that gets executed every time Sequelize would log something.
          benchmark: false, // Pass query execution time in milliseconds as second argument to logging function (options.logging).
          // omitNull: false, // A flag that defines if null values should be passed to SQL queries or not.
          // native: false, // A flag that defines if native library shall be used or not. Currently only has an effect for
          replication: { // Use read / write replication. To enable replication, pass an object, with two properties, read and write. Write should be an object (a single server for handling writes), and read an array of object (several servers to handle reads). Each read/write server can have the following properties: `host`, `port`, `username`, `password`, `database`
            write: {
              host: 'localhost', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: process.env.MYSQL_USER_NAME, // The username which is used to authenticate against the database.
              password: process.env.MYSQL_USER_PASSWORD, // The password which is used to authenticate against the database.
              pool: { // Should sequelize use a connection pool. Default is true
                max: 10, // Maximum number of connection in pool. Default is 5
                min: 5, // Minimum number of connection in pool. Default is 0
                idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
                // acquire: ?? * 1000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
                // validate: ??, // {Function} A function that validates a connection. Called with client. The default function checks that client is an object, and that its state is not disconnected
              },
            },
            read: [{
              host: 'localhost', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: process.env.MYSQL_USER_NAME, // The username which is used to authenticate against the database.
              password: process.env.MYSQL_USER_PASSWORD, // The password which is used to authenticate against the database.
              pool: { // Should sequelize use a connection pool. Default is true
                max: 10, // Maximum number of connection in pool. Default is 5
                min: 5, // Minimum number of connection in pool. Default is 0
                idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
                // acquire: ?? * 1000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
                // validate: ??, // {Function} A function that validates a connection. Called with client. The default function checks that client is an object, and that its state is not disconnected
              },
            }],
          },
          // quoteIdentifiers: true, // Set to `false` to make table names and attributes case-insensitive on Postgres and skip double quoting of them.  WARNING: Setting this to false may expose vulnerabilities and is not reccomended!
          // transactionType: 'DEFERRED', // Set the default transaction type. See `Sequelize.Transaction.TYPES` for possible options. Sqlite only.
          // isolationLevel: `Sequelize.Transaction.ISOLATION_LEVELS`, // Set the default transaction isolation level. See `Sequelize.Transaction.ISOLATION_LEVELS` for possible options.
          retry: { // Set of flags that control when a query is automatically retried.
          //  match: ??, // Only retry a query if the error matches one of these strings.
            max: 3, // How many times a failing query is automatically retried.  Set to 0 to disable retrying on SQL_BUSY error.
          //   typeValidation: false, // Run built in type validators on insert and update, e.g. validate that arguments passed to integer fields are integer-like.
          },
        },
      },
    },

    // JWT認証
    auth_jwt: {
      token_expire: 1 * 24 * 60 * 60 * 1000, // 1日
      algorithm: 'RS512',
      claims: {
        iss: 'viron-demo',
        aud: 'viron.prd',
      },
      rsa_private_key: process.env.AUTH_JWT_PRIVATE_KEY,
      rsa_public_key: process.env.AUTH_JWT_PUBLIC_KEY,
    },

    ssl: {
      use: false,
      key: process.env.SSL_PRIVATE_KEY,
      cert: process.env.SSL_CERTIFICATE,
    },
  };
  return config;
};
