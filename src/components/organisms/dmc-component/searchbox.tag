dmc-component-searchbox.Component__searchBox
  .Component__searchBoxInputs
    .Component__searchBoxInput(each="{ query in queries }")
      .Component__searchBoxInputLabel { query.key }
      dmc-textinput(id="{ query.key }" text="{ query.value }" placeholder="{ query.type }" onChange="{ parent.handleInputChange }")
  .Component__searchBoxControls
    dmc-button(label="search" onPat="{ handleSearchButtonPat }")
    dmc-button(label="cancel" type="secondary" onPat="{ handleCancelButtonPat }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import script from './searchbox';
    this.external(script);
