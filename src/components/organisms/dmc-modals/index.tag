dmc-modals.Modals
  virtual(each="{ modals }")
    dmc-modal(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ modalOpts.theme }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './partial.tag';
    import script from './index';
    this.external(script);
