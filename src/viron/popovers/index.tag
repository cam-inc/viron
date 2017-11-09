viron-application-popovers.Application_Popovers
  virtual(each="{ popovers }")
    viron-popover(id="{ id }" tagName="{ tagName }" tagOpts="{ tagOpts }" popoverOpts="{ popoverOpts }")

  script.
    import '../../components/viron-popover/index.tag';
    import script from './index';
    this.external(script);
