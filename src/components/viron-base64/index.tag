viron-base64.Base64
  virtual(if="{ isImage }")
    // Data URI Schemeで表示する。
    // @see: https://ja.wikipedia.org/wiki/Data_URI_scheme
    .Base64__content(style="background-image:url(data:{ mimeType };base64,{ opts.val })")
  // TODO: image以外にも対応すること。
  .Base64__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
