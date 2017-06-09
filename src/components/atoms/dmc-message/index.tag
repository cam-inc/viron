vam-message(class="Message Message--{ type }")
  .Message__head
    .Message__icon
      vam-icon(type="{ icon }")
    .Message__title { title }
  .Message__text(if="{ !!message }") { message }

  script.
    import '../../atoms/vam-icon/index.tag';
    import script from './index';
    this.external(script);
