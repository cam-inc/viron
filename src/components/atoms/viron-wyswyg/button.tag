viron-wyswyg-button.Wyswyg__button(class="{ 'Wyswyg__button--active' : opts.isactive }" onClick="{ handleClick }")
  yield.

  script.
    import script from './button';
    this.external(script);
