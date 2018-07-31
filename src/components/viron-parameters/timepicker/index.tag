viron-parameters-timepicker.Parameters_Timepicker
  .Parameters_Timepicker__content
    viron-timepicker(val="{ opts.isoString }" onChange="{ handleTimepickerChange }")
  .Parameters_Timepicker__tail
    viron-button(label="OK" onSelect="{ handleOKButtonTap }")

  script.
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-timepicker/index.tag';
    import script from './index';
    this.external(script);
