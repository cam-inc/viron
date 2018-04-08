viron-wyswyg.Wyswyg(class="{ 'Wyswyg--disabled': opts.isdisabled, 'Wyswyg--preview': opts.ispreview, 'Wyswyg--error': opts.haserror }")
  virtual(if="{ !opts.ispreview }")
    form.Wyswyg__form
      textarea(class="Wyswyg__editor{ _riot_id }")
  virtual(if="{ opts.ispreview }")
    .Wyswyg__form
      viron-raw(content="{ opts.val }")

  script.
    import '../../components/viron-raw/index.tag';
    import script from './index';
    this.external(script);
