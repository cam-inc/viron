viron-wyswyg.Wyswyg(class="{ 'Wyswyg--disabled': opts.isdisabled, 'Wyswyg--preview': opts.ispreview, 'Wyswyg--error': opts.haserror }")
  form.Wyswyg__form
    textarea(class="Wyswyg__editor{ _riot_id }")

  script.
    import script from './index';
    this.external(script);
