dmc-wyswyg.Wyswyg
  .Wyswyg__editor(ref="editor")
    p Hello World!
    p Some initial
      strong bold
    p
      br

  script.
    import script from './index';
    this.external(script);
