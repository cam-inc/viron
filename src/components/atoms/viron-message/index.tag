viron-message(class="Message Message--{ type }")
  .Message__head
    .Message__icon
      viron-icon(type="{ icon }")
    .Message__title { title }
  .Message__text(if="{ !!message }") { message }
  viron-prettyprint(if="{ !!detail }" class="Message__error" data="{ detail }")

  script.
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-prettyprint/index.tag';
    import script from './index';
    this.external(script);
