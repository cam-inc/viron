viron-application-mediapreviews.Application_Mediapreviews
  virtual(each="{ mediapreviews }")
    viron-mediapreview(id="{ id }" tagOpts="{ tagOpts }" mediapreviewOpts="{ mediapreviewOpts }")

  script.
    import '../../components/viron-mediapreview/index.tag';
    import script from './index';
    this.external(script);
