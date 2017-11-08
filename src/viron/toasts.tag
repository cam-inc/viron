viron-application-toasts.Application_Toasts
  virtual(each="{ toasts }")
    viron-toast(id="{ id }"
      type="{ type }"
      message="{ message }"
      autohide="{ autoHide }"
      timeout="{ timeout }"
      link="{ link }"
      linkText="{ linkText }")

  script.
    import '../components/viron-toast/index.tag';
    import script from './toasts';
    this.external(script);
