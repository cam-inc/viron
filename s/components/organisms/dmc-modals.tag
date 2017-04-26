dmc-modals.Modals
  virtual(each="{ modals }")
    dmc-modal(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ modalOpts.theme }")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-modal.tag';

    const store = this.riotx.get();

    this.modals = store.getter(constants.GETTER_MODAL_LIST);

    store.change(constants.CHANGE_MODAL, (err, state, store) => {
      this.modals = store.getter(constants.GETTER_MODAL_LIST);
      this.update();
    });
