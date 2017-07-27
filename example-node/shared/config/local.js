module.exports = helper => {
  const config = {
    scheme: 'https',
    host: 'localhost',
    port: 3000,

    default_role: 'viewer',
    super_role: 'super',

    google_oauth: {
      client_id: '18099482953-ea1glis8jec14lk71cdrfaak46abd6ni.apps.googleusercontent.com',
      client_secret: 'f3KXzLnwDcLc7X5UWm-o95wX',
      redirect_url: 'https://localhost:3000/googleoauth2callback',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      state_url: 'http://localhost:8080',
      allow_email_domains: [
        // ここに書いたドメインがGoogle認証で利用可能
        'camobile.com',
      ],
    },

    cors: {
      allow_origin: 'http://localhost:8080',
      allow_headers: 'X-Requested-With, Origin, Content-Type, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
      expose_headers: 'X-Requested-With, Origin, Content-Type, Accept, Authorization, X-Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page',
    },

    stores: {
      main: {
        type: 'mysql',
        config: {
          database: 'dmc_local', // The name of the database
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
              host: 'local-dmc-mysql.in.dmc.biz', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: 'user', // The username which is used to authenticate against the database.
              password: 'password', // The password which is used to authenticate against the database.
              pool: { // Should sequelize use a connection pool. Default is true
                max: 10, // Maximum number of connection in pool. Default is 5
                min: 5, // Minimum number of connection in pool. Default is 0
                idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
                // acquire: ?? * 1000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
                // validate: ??, // {Function} A function that validates a connection. Called with client. The default function checks that client is an object, and that its state is not disconnected
              },
            },
            read: [{
              host: 'local-dmc-mysql.in.dmc.biz', // The host of the relational database.
              port: 3306, // The port of the relational database.
              username: 'user', // The username which is used to authenticate against the database.
              password: 'password', // The password which is used to authenticate against the database.
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

    auth_jwt: {
      header_key: 'Authorization',
      token_expire: 1 * 24 * 60 * 60 * 1000, // 1日
      credentials_required: true,
      algorithm: 'RS512',
      claims: {
        iss: 'dmc-example-node',
        aud: 'dmc.local',
      },
      rsa_private_key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAs/PFsXu7tv7cYOSwj3CWkt1HwGtWXr5oqmj5/h+v5doXO6rU
PqYfogFJ4+QIAxhtQc4EB5bgHFTp6kPta0oFsSGdV8WJQkV2PzducbwDdg85oR2z
tXxuv4UnVQet+jym4VSs/wH3+LhtW3YO6OwWYuZSdbSWIhmVYulxfM/H8Jlwx/CJ
H2JZxL2+u5qM6bIUwHMZ6d/Q4Nw43INrUXAj3eJv1QuB58H6LgAsGaLI8/T+0g7o
CXdyEuG1TEJ2qQ2VQDHPeAF9X8rGIHj+ilTBc52Qvi6IW9bE2Zzzq2HObKWCXnkE
wUTijCcIgnKMnF95S/edQIGbG5q3//Or9jDyoQIDAQABAoIBADnoCsi3GUukrYPc
c1hlEX8HB8zKfYuVWBbmGvQEfFTJnkpMCWpziKBYK8/SlCVy2c2gHrnWeh2D0ZXZ
7+9jbXt3ZqtU3Htf4NIs4zRkHPUDpzbKWQbgmL62eVaqVvi8RbMizVxt5L67ki0p
S1j2h6mhlg1cZCdq9iBTIHraXet02pmZbrbciyMxqOuPej8NiASkzpxMN8VVfjfm
o1kOhjoIif36h0xqzj7JB4zy2NihaD7XuVFAtDohf2fIV7CmEb8LJpupmaK++LF9
BIpcsEfPI08nXJcLPGpXHycHbnHhYLpM8ZosxUt4FEapc67oBgiwfQRtkkVE5DEa
irWueAECgYEA3bnr5kCj89HdA6oWOasrZl9FxZqSzhdXsvgwZqcPLHXcx2FwC12T
yQ2Qn0a1YMzcnM0P7/setCYoVCZ/4KFwZtxdOLuzZsjaiX1lu3yJsp0AqX/sPtZf
z8q2sDXuJMHw2ka9jF2ukRkaEaB22OhDdFo/XeGIr5mx6SvXprnUA2ECgYEAz8TI
b1k2Fs4yN/nzQQRiAh/oWi8MrFakkDepFLeQNUWvAmIlIOATL8jDq2PpPuLoQM3Z
RnyRm4AbgUB4EinfjXk+s0bVRukvZBI2KUpNsL4flzUAN7JCgtXHYDbeNqIyyTAG
yDCGoPs++vPUtQvwWx9nmXGP68bFrAao3BgKd0ECgYEAzEFa/EjuAE2DMb39LXDu
0SbRKqEjvjEovBkA1X/ubYHCOfYb9oxk+SDC6seDjUILtXL+zI9kkIZaPnMc+H0g
A9HbGslnEjfTgjb/gcDPRLh3hK3wn05zAwP2WcvErx3uV9Y1BVrD1qzuI/DTqywD
/+qnVz/N4B5RE8Esr02e7uECgYBXCgop04a8UQ9qsdR9NVfVqgZN2Y4GmJmCLT8x
BaFtH88sQW9qcVS4XPPT1hw9kxNXKqVOSRs6uJVNNXPXsCEOBHAG7LKmbUPEOXjl
HVKkq1FSqAp6SrxgUSygGvxGiPabn/oHXYTY5chBm2pNmj3L/sEI4DE5xeDDq1qM
MaoYwQKBgQDAMCXgPj0PKN2MVFjHaIPf0KJgUsd36OeFmJzbLS4fnHXRzOlNTfRt
GubMBuqzFSbMbGgaSBLs94Gn8BhCPRRgHR+lLjMv6hKuKfsp2twl5+JDkJD1ikjn
77/bNBv+dcdfrfAElAtwAmWLaLuDRwZb0H4IhgSutN2xJ3PdZl8jgg==
-----END RSA PRIVATE KEY-----`,
      rsa_public_key: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs/PFsXu7tv7cYOSwj3CW
kt1HwGtWXr5oqmj5/h+v5doXO6rUPqYfogFJ4+QIAxhtQc4EB5bgHFTp6kPta0oF
sSGdV8WJQkV2PzducbwDdg85oR2ztXxuv4UnVQet+jym4VSs/wH3+LhtW3YO6OwW
YuZSdbSWIhmVYulxfM/H8Jlwx/CJH2JZxL2+u5qM6bIUwHMZ6d/Q4Nw43INrUXAj
3eJv1QuB58H6LgAsGaLI8/T+0g7oCXdyEuG1TEJ2qQ2VQDHPeAF9X8rGIHj+ilTB
c52Qvi6IW9bE2Zzzq2HObKWCXnkEwUTijCcIgnKMnF95S/edQIGbG5q3//Or9jDy
oQIDAQAB
-----END PUBLIC KEY-----`,
    },

    ssl: {
      use: true,
      key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAyq2RhKS0r2bcMjzdlplYL5TdCE1pME1noaUH1MsWJRrI/ZmK
LfXUULulXPGsROV07G+28qq2aFnEDs6sknrOnQ+l9JV1qvFfmDD16W20WVXZglel
6saCtMEbpWr4Tvi34I30U+q86ABc+sMjOl6xVwXyXNPTp6mE/eYX/D4N+yXvMGqI
GuRMi26mw8zB/F2XzM6AM0SBUCv2QXDBfuBavwMCqUu+7fXSpblf8CHstJVEGOmP
tA6NhCBhMMZyatQYHJ3EN0D1Z67PClmJHKidYulsPP6RuPU7vUeUE2ikvwfA+AQ1
uvAdlQ6rku7jKFO/VnMtLvg96UrUExUj7cvh0QIDAQABAoIBAQCmFi/+W555cjgV
rw0C4WyDqWCr8gu1+mhm7T8KoNXn2BhGwTCb0yyGcA7lqGG8H7B+JFnuZ/iMcKsa
W0DN1HdF+9HKKURArgXhSJXsEOtOnexdRIgBaWUozGpkVtFenbDJAmrq7ZyaHdoT
4B8ZMQn11Y1hYH1hh8Ik8g5LtWptmETTfveNQ9P0PFhyn4DLNStUJQZUyuqLg9BS
6fLxGu5Xz3DQwMLPj3puU3e2X8YNg+qX1pGoX29kB7RndH7LsHoEsBNibtcYVL3v
KnFMGtwyVHAZL+3Qj3IX4KWOt6/AP/AwG6tcJggnp7hYnHYwEiwjydWUUlBFO9l9
f9xEb93FAoGBAPe03gF3BtqG25N/KZcagVdJ0ILJQDBigyJ9Igzn988LHWzTEuTP
zF1wLaHRMNLItaxxm3BIZ5O6rhzDpKFjPeZJpu4VFfJVFe2tzFsTK3sI0iUBOeKX
mpoQpAf7+bE7Mz2cUt2O8YCcQ/dR3m7zAX+J0JuQWvFxh1wt86YgTekPAoGBANF2
wSkXRZHl1j2gOf77SVs2tSkmdMIUhXaWStrEMYNyqOCaVFlRXr7oyDf4V8Vbd/sq
gVqOt1w7pzliu0DVZ85CcJC+6vQW/2mbKodx6ffInYI/fbOzBVdW8porvlXA/Up0
9k7YGOyiwvQNGj24r/Lm3ePBWIGnKLnCwYI0rscfAoGBAL0M20s+7ool1ruRl8pt
Pj3CZlMLCeRjqzXNTwmOmQD5uLFvvsHHHnBJx2ny4FJfQNiltD5T5ElJds0ZPDK4
LWvu1mpqyV80NRI7TPZNgSfbqZb4gpc/oYzoGmjFlOIBDrB8+HmEOSkxGmZNo3gG
GySdqAqyd9ZCEU72+zfU++FdAoGAfit+JnYyHbPH3M8KoCBVC3BkpyjW46Dg05Gr
/SJ4gKksOD492J8+5tfo4m3g0KxMFSqBSD73C8OS8uoZyO/C22cBzu5xMB46My6X
64YeXHanCbGc0gVfjkB9WYhH2fepmpPhWZSpTsCrlb3etJbuxO1zcqEf4tkBmwNI
9FkvfhkCgYBCFKlfk/V9xyBblMpMpN0U0+CflaKUgP21loy9KF7UB/L2wez6RXD+
rfTO8D7pfxoLDSbiT8fUmIdMvGSCislV0p2O1MxoMVB+0mFBY3TpkYn1TV/wEMOn
LZoqxGy+Q8cFB0UfVR1m3bBIrSgxcqo7F5DyUFQAsnR4407O8SpCDw==
-----END RSA PRIVATE KEY-----`,
      cert: `-----BEGIN CERTIFICATE-----
MIIDQjCCAioCCQCtIbiPuETQEzANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQGEwJK
UDEPMA0GA1UECBMGVG9sa3lvMRAwDgYDVQQHEwdTaGlidXlhMQwwCgYDVQQKEwNE
bWMxDjAMBgNVBAsTBUxvY2FsMRIwEAYDVQQDEwlkbWMubG9jYWwwIBcNMTcwNzI2
MDMwODA4WhgPMjIxNzA2MDgwMzA4MDhaMGIxCzAJBgNVBAYTAkpQMQ8wDQYDVQQI
EwZUb2xreW8xEDAOBgNVBAcTB1NoaWJ1eWExDDAKBgNVBAoTA0RtYzEOMAwGA1UE
CxMFTG9jYWwxEjAQBgNVBAMTCWRtYy5sb2NhbDCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAMqtkYSktK9m3DI83ZaZWC+U3QhNaTBNZ6GlB9TLFiUayP2Z
ii311FC7pVzxrETldOxvtvKqtmhZxA7OrJJ6zp0PpfSVdarxX5gw9elttFlV2YJX
perGgrTBG6Vq+E74t+CN9FPqvOgAXPrDIzpesVcF8lzT06ephP3mF/w+Dfsl7zBq
iBrkTItupsPMwfxdl8zOgDNEgVAr9kFwwX7gWr8DAqlLvu310qW5X/Ah7LSVRBjp
j7QOjYQgYTDGcmrUGBydxDdA9WeuzwpZiRyonWLpbDz+kbj1O71HlBNopL8HwPgE
NbrwHZUOq5Lu4yhTv1ZzLS74PelK1BMVI+3L4dECAwEAATANBgkqhkiG9w0BAQsF
AAOCAQEAJmft1U937Mv7m/FxdLiNwwUYA9n3jj9q4CLOSM1x4gXPvQy3Rk6ULFQz
3dsYhPpdONIuy+YtArDiPFOrPAdqV0LRT/fOqfAvjMXf6unbI0m/FDlfRFPnqldY
57nC4uaPnwWe9GhzZ8Sz2juCTR6ItW3+2QNpVbESze7caa92oB9X9eEtDT5GhWqy
2XhMF31Uw5PGJbTajBZFKaqfeNRm9tGajcJNo2di3j4eeXwqEZ8VeT9eBcOcZY4U
KnvGyMlX2q19TEBXKrKz4jwdeRZePw0+KX6qvNhd9pEAucMF5RyHkOzUw2+olgyg
Kn7FGEgtji8ObnysKsHJQ4/P0i1n8g==
-----END CERTIFICATE-----`
    },
  };
  return config;
};
