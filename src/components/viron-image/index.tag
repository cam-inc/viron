viron-image.Image
  .Image__content(style="background-image:url({ opts.val })")
  .Image__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
