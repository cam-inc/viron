viron-jsonviewer
  div(each="{ obj in json }")
    div { obj }

  script.
    import script from './index';
    this.external(script);
