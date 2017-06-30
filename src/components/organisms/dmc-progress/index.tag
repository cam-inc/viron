dmc-progress.Progress
  .Progress__spinner
    dmc-icon(type="loading")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
