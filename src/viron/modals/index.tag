viron-application-modals.Application_Modals
  virtual(each="{ modals }")
    viron-modal(id="{ id }" tagName="{ tagName }" tagOpts="{ tagOpts }" modalOpts="{ modalOpts }")

  script.
    import '../../components/viron-modal/index.tag';
    import script from './index';
    this.external(script);
