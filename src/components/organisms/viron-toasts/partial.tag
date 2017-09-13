viron-toast(class="Toast Toast--{ opts.type }" ref="touch" onTap="handleTap")
  .Toast__icon
    viron-icon(if="{ opts.type === 'normal' }" type="close")
    viron-icon(if="{ opts.type === 'error' }" type="exclamation")
  .Toast__message { opts.message }
  .Toast__link(if="{ !!opts.link }" ref="touch" onTap="handleLinkTap") { opts.linktext }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './partial';
    this.external(script);
