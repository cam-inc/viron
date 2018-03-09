viron-application-drawers.Application_Drawers
  virtual(each="{ drawers }")
    viron-drawer(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" depth="{ drawerOpts.depth }" theme="{ drawerOpts.theme }" isNarrow="{ drawerOpts.isNarrow }" isWide="{ drawerOpts.isWide }")

  script.
    import '../../components/viron-drawer/index.tag';
    import script from './index';
    this.external(script);
