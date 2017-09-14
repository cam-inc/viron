viron-wyswyg-button.Wyswyg__button(class="{ 'Wyswyg__button--active' : opts.isactive }" ref="touch" onTap="handleTap")
  yield.

  script.
    import script from './button';
    this.external(script);
