dmc-message(class="Message Message--{ type }")
  .Message__head
    .Message__icon
      dmc-icon(type="{ icon }")
    .Message__title { title }
  .Message__text(if="{ !!message }") { message }

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
