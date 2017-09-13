viron-toasts.Toasts
  virtual(each="{ toasts }")
    viron-toast(id="{ id }"
      type="{ type }"
      message="{ message }"
      autohide="{ autoHide }"
      timeout="{ timeout }"
      link="{ link }"
      linkText="{ linkText }")

  script.
    import './partial.tag';
    import script from './index';
    this.external(script);
