viron-modals.Modals
  virtual(each="{ modals }")
    viron-modal(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ modalOpts.theme }")

  script.
    import '../../atoms/viron-icon/index.tag';
    import './partial.tag';
    import script from './index';
    this.external(script);
