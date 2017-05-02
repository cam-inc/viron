dmc-radios.Radios
  virtual(each="{ opts.radios }")
    dmc-radio(id="{ id }" isSelected="{ isSelected }" isDisabled="{ isDisabled }" label="{ label }" onChange="{ parent.handleRadioChange }")

  script.
    import { map } from 'mout/array';
    import '../atoms/dmc-radio.tag';

    handleRadioChange(bool, radioID) {
      const radios = map(this.opts.radios, radio => {
        if (radio.id === radioID) {
          radio.isSelected = bool;
        } else {
          radio.isSelected = false;
        }
        return radio;
      });
      this.opts.onchange && this.opts.onchange(radios);
    }
