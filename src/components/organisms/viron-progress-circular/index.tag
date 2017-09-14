viron-progress-circular.ProgressCircular
  .ProgressCircular__spinner
    viron-icon(type="loading")

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
