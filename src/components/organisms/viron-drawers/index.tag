viron-drawers.Drawers
  virtual(each="{ drawers }")
    viron-drawer(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ drawerOpts.theme }")

  script.
    import './partial.tag';
    import script from './index';
    this.external(script);
