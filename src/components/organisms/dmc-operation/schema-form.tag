dmc-operation-schema-form.Operation__schemaForm
  .Operation__schemaFormDescription { opts.parameterobject.description || '-' }
  .Operation__schemaFormRequired(if="{ opts.parameterobject.required }") required
  .Operation__schemaFormName name: { opts.parameterobject.name }
  .Operation__schemaFormType type: { opts.parameterobject.type }
  .Operation__schemaFormFormat format: { opts.parameterobject.format || '-' }
  .Operation__schemaFormMultiPlusButton(if="{ uiType === 'multi' }" ref="touch" onTap="handleMultiPlusButtonTap")
    dmc-icon(type="plus")
  virtual(if="{ uiType === 'input' }")
    dmc-textinput(text="{ opts.parametervalue }" placeholder="{ opts.parameterobject.example }" onChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    dmc-select(options="{ getSelectOptions() }" onChange="{ handleSelectChange }")
  .Operation__schemaFormChildren(if="{ uiType === 'multi' }" each="{ p, idx in multiData }")
    .Operation__schemaFormMultiMinusButton(ref="touch" idx="{ idx }" onTap="handleMultiMinusButtonTap")
      dmc-icon(type="minus")
    dmc-operation-schema-form(each="{ propertyKey in parent.multiPropertyKeys }" multiIdx="{ parent.idx }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey, parent.idx) }" onChange="{ parent.handleMultiChange }")

  script.
    import '../../atoms/dmc-checkbox/index.tag';
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-select/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import script from './schema-form';
    this.external(script);
