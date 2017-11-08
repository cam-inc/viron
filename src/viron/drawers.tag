viron-application-drawers.Application_Drawers
  virtual(each="{ drawers }")
    viron-drawer(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ drawerOpts.theme }")

  script.
    import '../components/viron-drawer/index.tag';
    import script from './drawers';
    this.external(script);
