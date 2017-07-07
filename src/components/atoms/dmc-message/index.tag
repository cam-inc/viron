dmc-message(class="Message Message--{ type }")
  .Message__head
    .Message__icon
      dmc-icon(type="{ icon }")
    .Message__title { title }
  .Message__text(if="{ !!message && !opts.error }") { message }
  dmc-prettyprint(if="{ !!opts.error }" class="Message__error" data="{ opts.error }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-prettyprint/index.tag';
    import script from './index';
    this.external(script);
