dmc-timepicker-partial.Partialtime
  input.Partialtime__input(onClick="{ handleInputTime }" value="")
  .Partialtime__body(if="{ this.isShowTimepicker }")
    input.Partialtime__input.Partialtime__input--modifier(value="{ this.displayTime }")
    ul.Partialtime__list.Partialtime__list--left
      li.Partialtime__listItem(each="{ generateHours() }" value="{ hour }") { hour }
    ul.Partialtime__list.Partialtime__list--center
      li.Partialtime__listItem(each="{ generateMinutes() }" value="{ minute }") { minute }
    ul.Partialtime__list.Partialtime__list--right
      li.Partialtime__listItem(each="{ generateSeconds() }" value="{ second }") { second }

    script.
      import script from './partial';
      this.external(script);
