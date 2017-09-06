dmc-message(class="Message Message--{ type }")
  .Message__head
    .Message__icon
      dmc-icon(type="{ icon }")
    .Message__title { title }
  .Message__text(if="{ !!message }") { message }
  dmc-prettyprint(if="{ !!detail }" class="Message__error" data="{ detail }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-prettyprint/index.tag';
    import script from './index';
    this.external(script);
