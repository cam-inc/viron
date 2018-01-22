viron-toast.Toast(class="{ 'Toast--visible' : isVisible, 'Toast--settled': isSettled, 'Toast--error' : opts.iserror }" onTap="{ handleTap }")
  .Toast__message { opts.message }

  script.
    import script from './index';
    this.external(script);
