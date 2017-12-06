viron-application-popovers.Application_Popovers
  virtual(each="{ popovers }")
    virtual(if="{ isDesktop }")
      viron-popover(id="{ id }" tagName="{ tagName }" tagOpts="{ tagOpts }" popoverOpts="{ popoverOpts }")
    virtual(if="{ isMobile }")
      viron-popover-spread(id="{ id }" tagName="{ tagName }" tagOpts="{ tagOpts }" popoverOpts="{ popoverOpts }")

  script.
    import '../../components/viron-popover/index.tag';
    import '../../components/viron-popover/spread/index.tag';
    import script from './index';
    this.external(script);
