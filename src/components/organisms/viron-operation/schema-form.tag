viron-operation-schema-form.Operation__schemaForm
  .Operation__schemaFormDescription { opts.parameterobject.description || '-' }
  .Operation__schemaFormRequired(if="{ opts.parameterobject.required }") required
  .Operation__schemaFormName name: { opts.parameterobject.name }
  .Operation__schemaFormType type: { opts.parameterobject.type }
  .Operation__schemaFormFormat format: { opts.parameterobject.format || '-' }
  .Operation__schemaFormMultiPlusButton(if="{ uiType === 'multi' }" onClick="{ handleMultiPlusButtonClick }")
    viron-icon(type="plus")
  virtual(if="{ uiType === 'input' }")
    viron-textinput(text="{ opts.parametervalue }" placeholder="{ opts.parameterobject.example }" onChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    viron-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    viron-select(options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
  // datepicker表示
  //virtual(if="{ uiType === 'datepicker' }")
  //  viron-datepicker(onDateChange="{ handleDateChange }")
  .Operation__schemaFormChildren(if="{ uiType === 'multi' }" each="{ p, idx in multiData }")
    .Operation__schemaFormMultiMinusButton(idx="{ idx }" onClick="{ handleMultiMinusButtonClick }")
      viron-icon(type="minus")
    viron-operation-schema-form(each="{ propertyKey in parent.multiPropertyKeys }" multiIdx="{ parent.idx }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey, parent.idx) }" onChange="{ parent.handleMultiChange }")

  script.
    import '../../atoms/viron-checkbox/index.tag';
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-select/index.tag';
    import '../../atoms/viron-textinput/index.tag';
    import script from './schema-form';
    this.external(script);
