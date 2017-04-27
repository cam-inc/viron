dmc-toasts.Toasts
  virtual(each="{ toasts }")
    dmc-toast(id="{ id }" type="{ type }" message="{ message }" autohide="{ autoHide }" timeout="{ timeout }")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-toast.tag';

    const store = this.riotx.get();

    this.toasts = store.getter(constants.GETTER_TOAST_LIST);

    store.change(constants.CHANGE_TOAST, (err, state, store) => {
      this.toasts = store.getter(constants.GETTER_TOAST_LIST);
      this.update();
    });
