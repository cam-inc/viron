viron-wyswyg.Wyswyg(class="{ 'Wyswyg--disabled': opts.isdisabled, 'Wyswyg--preview': opts.ispreview, 'Wyswyg--error': opts.haserror }")
  form.Wyswyg__form
    textarea(class="Wyswyg__editor{ _riot_id }")
  .Wyswyg__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
