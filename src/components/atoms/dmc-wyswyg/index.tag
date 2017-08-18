dmc-wyswyg.Wyswyg
  .Wyswyg__editor(ref="editor")
    h4 Hello
      span(class="Service__bold--todo") World!
    p Some initial
      span(class="Service__bold--todo") bold
    p
      br

  script.
    import script from './index';
    this.external(script);
