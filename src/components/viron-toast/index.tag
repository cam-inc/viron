viron-toast.Toast(class="Toast--{ opts.type }" onTap="{ handleTap }")
  .Toast__icon TODO
  .Toast__message { opts.message }
  .Toast__link(if="{ !!opts.link }" onTap="{ handleLinkTap }") { opts.linktext }

  script.
    import script from './index';
    this.external(script);
