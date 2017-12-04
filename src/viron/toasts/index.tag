viron-application-toasts.Application_Toasts
  virtual(each="{ toasts }")
    viron-toast(id="{ id }"
      message="{ message }"
      autohide="{ autoHide }"
      timeout="{ timeout }"
      isError="{ isError }")

  script.
    import '../../components/viron-toast/index.tag';
    import script from './index';
    this.external(script);
