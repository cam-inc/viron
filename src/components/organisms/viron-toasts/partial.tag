viron-toast(class="Toast Toast--{ opts.type }" onClick="{ handleClick }")
  .Toast__icon
    viron-icon(if="{ opts.type === 'normal' }" type="close")
    viron-icon(if="{ opts.type === 'error' }" type="exclamation")
  .Toast__message { opts.message }
  .Toast__link(if="{ !!opts.link }" onClick="{ handleLinkClick }") { opts.linktext }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './partial';
    this.external(script);
