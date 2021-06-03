---
id: auth
title: Authentication
slug: /
---

- [ ] 401
- [ ] x-viron-authtypes-path
- [ ] providerとかtypeとか
- [ ] 最初の一人のID/passはなんでもOK
- [ ] 認証用cookieの設定について
  - SameSite属性
    - SameSite=None
    - 独自配信する場合の設定はSameSite=Strict
  - Secure属性
    - 指定し、https通信上のみでcookieがサーバに送信されるようにすること。
  - HttpOnly属性
    - 指定し、JavaScriptのDocument.cookie APIアクセスを不可にする。
  - Domain属性
    - 指定すると制限が緩和されるので、未指定にするのがベター。(未指定時はcookieを送信したサーバのオリジンがdomain値となる)
    - stg/prdなど環境別にoasを提供するケースにおいて、サブドメインで環境分けをしている場合はDomain属性値にそのサブドメインを指定する必要がある。(環境をまたいでcookieが送信されてしまうため)
  - Path属性
    - 基本的には/を指定すること。
    - (レアケースだと思うけど...)stg/prdなど環境別にoasを提供するケースにおいて、pathnameで環境分けをしている場合はpath属性値にそのpathnameを指定する必要がある。(環境をまたいでcookieが送信されてしまうため)
  - Expires属性とMax-Age属性
    - ご自由に。
