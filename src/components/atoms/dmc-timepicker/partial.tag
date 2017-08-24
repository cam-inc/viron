dmc-timepicker-partial.Partialtime
  .Partialtime__body
    input.Partialtime__input.Partialtime__input--modifier(value="{ opts.partialtime }")
    ul.Partialtime__list.Partialtime__list--left
      li.Partialtime__listItem(onTap="handleSelectHour" ref="touch" each="{ hour in generateHours() }" value="{ hour.date }") { hour.hour }
    ul.Partialtime__list.Partialtime__list--center
      li.Partialtime__listItem(onTap="handleSelectMinute" ref="touch" each="{ minute in generateMinutes() }" value="{ minute.date }") { minute.minute }
    ul.Partialtime__list.Partialtime__list--right
      li.Partialtime__listItem(onTap="handleSelectSecond" ref="touch" each="{ second in generateSeconds() }" value="{ second.date }") { second.second }

    script.
      import script from './partial';
      this.external(script);
