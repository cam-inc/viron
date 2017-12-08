viron-wyswyg.Wyswyg(class="{ 'Wyswyg--disabled': opts.isdisabled, 'Wyswyg--error': opts.haserror }")
  .Wyswyg__editor(ref="editor")
  .Wyswyg__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import script from './index';
    this.external(script);
