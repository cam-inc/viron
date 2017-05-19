dmc-operation.Operation
  .Operation__info
    div
      .Operation__summary { summary }
      .Operation__description { opts.operation.description }
  .Operation__control
    dmc-button(label="{ opts.operation.operationId }" onClick="{ handleExecuteButtonClick }")
    dmc-button(label="cancel" type="secondary" onClick="{ handleCancelButtonClick }")
  .Operation__parameters
    dmc-operation-parameter(each="{ parameter in opts.operation.parameters }" parameter="{ parameter }" parameterValue="{ parent.queries[parameter.name] }" onChange="{ parent.handleParameterChange }")

  script.
    import ObjectAssign from 'object-assign';
    import swagger from '../../swagger';
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    this.summary = this.opts.operation.summary;
    if (!this.summary) {
      const obj = swagger.getMethodAndPathByOperationID(this.opts.operation.operationId);
      this.summary = `${obj.method} ${obj.path}`;
    }
    this.queries = ObjectAssign({}, this.opts.initialQueries);

    close() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
      if (this.opts.isDrawer) {
        this.opts.drawerCloser();
      }
    }

    handleParameterChange(key, value) {
      this.queries[key] = value;
      // TODO: deleteするためのもっと良い方法を模索すること。
      if (typeof value === 'string' && !value.length) {
        delete this.queries[key];
      }
      this.update();
    }

    handleExecuteButtonClick() {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_COMPONENTS_OPERATE, this.opts.operation, this.queries))
        .then(() => {
          this.close();
          this.opts.onSuccess();
        })
        .catch(err => store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message
        }));
    }

    handleCancelButtonClick() {
      this.close();
    }

dmc-operation-parameter.Operation__parameter
  .Operation__parameterHead
    div
      .Operation__parameterName name: { opts.parameter.name }
      .Operation__parameterDescription description: { opts.parameter.description }
      .Operation__parameterIn in: { opts.parameter.in }
    .Operation__parameterRequired(if="{ opts.parameter.required }") required
  .Operation__parameterBody
    dmc-operation-schema(if="{ isUseBody }" name="{ opts.parameter.name}" schema="{ opts.parameter.schema }" parameterValues="{ opts.parametervalue }" onChange="{ handleChange }")
    dmc-operation-parameter-form(if="{ !isUseBody }" parameterObject="{ this.opts.parameter }" parameterValue="{ opts.parametervalue }" onChange="{ handleChange }")

  script.
    this.isUseBody = false;
    // Possible values are "query", "header", "path", "formData" or "body".
    if (this.opts.parameter.in === 'body') {
      this.isUseBody = true;
    }

    handleChange(key, value) {
      this.opts.onchange(key, value);
    }

dmc-operation-schema.Operation__schema
  dmc-operation-schema-form(each="{ propertyKey in propertyKeys }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey) }" onChange="{ parent.handleChange }")

  script.
    import { contains } from 'mout/array';
    import { forOwn } from 'mout/object';

    this.propertyKeys = Object.keys(opts.schema.properties);

    getParameterObject(propertyKey) {
      return ObjectAssign({}, this.opts.schema.properties[propertyKey], {
        name: propertyKey,
        required : contains(this.opts.schema.required, propertyKey)
      });
    }

    getValue(propertyKey) {
      if (!this.opts.parametervalues) {
        return;
      }
      return this.opts.parametervalues[propertyKey];
    }

    handleChange(name, value) {
      const values = ObjectAssign({}, this.opts.parametervalues, {
        [name]: value
      });
      forOwn(values, (v, k) => {
        // TODO: deleteするためのもっと良い方法を模索すること。
        if (typeof v === 'string' && !v.length) {
          delete values[k];
        }
      });
      this.opts.onchange(this.opts.name, values);
    }

dmc-operation-schema-form.Operation__schemaForm
  .Operation__schemaFormDescription { opts.parameterobject.description || '-' }
  .Operation__schemaFormRequired(if="{ opts.parameterobject.required }") required
  .Operation__schemaFormName name: { opts.parameterobject.name }
  .Operation__schemaFormType type: { opts.parameterobject.type }
  .Operation__schemaFormFormat format: { opts.parameterobject.format || '-' }
  .Operation__schemaFormMultiPlusButton(if="{ uiType === 'multi' }" onClick="{ handleMultiPlusButtonClick }")
    dmc-icon(type="plus")
  virtual(if="{ uiType === 'input' }")
    dmc-input(text="{ opts.parametervalue }" placeholder="{ opts.parameterobject.example }" onTextChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    dmc-select(isOpened="{ isOpened }" options="{ getSelectOptions() }" onToggle="{ handleSelectToggle }" onChange="{ handleSelectChange }")
  .Operation__schemaFormChildren(if="{ uiType === 'multi' }" each="{ p, idx in multiData }")
    .Operation__schemaFormMultiMinusButton(onClick="{ handleMultiMinusButtonClick }")
      dmc-icon(type="minus")
    dmc-operation-schema-form(each="{ propertyKey in parent.multiPropertyKeys }" multiIdx="{ parent.idx }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey, parent.idx) }" onChange="{ parent.handleMultiChange }")

  script.
    import { find, forEach } from 'mout/array';
    import '../atoms/dmc-checkbox.tag';
    import '../atoms/dmc-input.tag';
    import '../atoms/dmc-select.tag';

    // type will be one of 'null', 'boolean', 'object', 'array', 'number' or 'string'.
    const type = opts.parameterobject.type;
    this.uiType = null;
    this.isOpened = false;
    this.multiSchema = null;
    this.multiData = null;
    this.multiPropertyKeys = null;
    if (!!opts.parameterobject.enum) {
      this.uiType = 'select';
    } else {
      switch (type) {
        case 'string':
        case 'number':
          this.uiType = 'input';
          break;
        case 'boolean':
          this.uiType = 'checkbox';
          break;
        case 'array':
          this.uiType = 'multi';
          if (this.opts.parametervalue) {
            this.multiData = this.opts.parametervalue;
          }
          this.multiSchema = opts.parameterobject.items;
          this.multiPropertyKeys = Object.keys(opts.parameterobject.items.properties);
          break;
        case 'object':
        case 'null':
        default:
          break;
      }
    }

    getParameterObject(propertyKey) {
      return ObjectAssign({}, this.multiSchema.properties[propertyKey], {
        name: propertyKey,
        required : contains(this.multiSchema.required, propertyKey)
      });
    }

    getValue(propertyKey, idx) {
      if (!this.multiData[idx][propertyKey]) {
        return;
      }
      return this.multiData[idx][propertyKey];
    }

    getSelectOptions() {
      const options = [];
      forEach(this.opts.parameterobject.enum, (v, idx) => {
        options.push({
          id: `select_${idx}`,
          label: v,
          isSelected: (v === this.opts.parametervalue)
        });
      });
      return options;
    }

    change(value) {
      // TODO: format, validate
      if (this.opts.parameterobject.type === 'number' || this.opts.parameterobject.type === 'integer') {
        value = Number(value);
      }
      this.opts.onchange(this.opts.parameterobject.name, value, this.opts.multiidx);
    }

    handleMultiPlusButtonClick(e) {
      e.preventUpdate = false;
      this.multiData = this.multiData || [];
      this.multiData.push({});
      this.change(this.multiData);
    }

    handleMultiMinusButtonClick(e) {
      e.preventUpdate = false;
      this.multiData.splice(e.item.idx, 1);
      this.change(this.multiData);
    }

    handleInputChange(value) {
      this.change(value);
    }

    handleCheckboxChange(isChecked) {
      this.change(isChecked);
    }

    handleSelectToggle(isOpened) {
      this.isOpened = isOpened;
      this.update();
    }

    handleSelectChange(options) {
      const option = find(options, option => {
        return option.isSelected;
      });
      const value = (option ? option.label : undefined);
      this.change(value);
    }

    handleMultiChange(key, value, idx) {
      if (value === undefined || idx === undefined) {
        // TODO: 原因調査
        return;
      }
      this.multiData[idx][key] = value;
      this.change(this.multiData);
    }

dmc-operation-parameter-form.Operation__parameterForm
  virtual(if="{ uiType === 'input' }")
    dmc-input(text="{ opts.parametervalue }" onTextChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    dmc-select(isOpened="{ isOpened }" options="{ getSelectOptions() }" onToggle="{ handleSelectToggle }" onChange="{ handleSelectChange }")

  script.
    import '../atoms/dmc-checkbox.tag';
    import '../atoms/dmc-input.tag';
    import '../atoms/dmc-select.tag';

    const type = opts.parameterobject.type;
    this.uiType = null;
    this.isOpened = false;
    if (!!opts.parameterobject.enum) {
      this.uiType = 'select';
    } else {
      switch (type) {
        case 'string':
        case 'number':
        case 'integer':
          this.uiType = 'input';
          break;
        case 'boolean':
          this.uiType = 'checkbox';
          break;
        case 'array':
          this.uiType = 'TODO';
          break;
        case 'file':
          this.uiType = 'TODO';
          break;
        default:
          break;
      }
    }

    getSelectOptions() {
      const options = [];
      forEach(this.opts.parameterobject.enum, (v, idx) => {
        options.push({
          id: `select_${idx}`,
          label: v,
          isSelected: (v === this.opts.parametervalue)
        });
      });
      return options;
    }

    change(value) {
      // TODO: format, validate
      if (this.opts.parameterobject.type === 'number' || this.opts.parameterobject.type === 'integer') {
        value = Number(value);
      }
      this.opts.onchange(this.opts.parameterobject.name, value);
    }

    handleInputChange(value) {
      this.change(value);
    }

    handleCheckboxChange(isChecked) {
      this.change(isChecked);
    }

    handleSelectToggle(isOpened) {
      this.isOpened = isOpened;
      this.update();
    }

    handleSelectChange(options) {
      const option = find(options, option => {
        return option.isSelected;
      });
      const value = (option ? option.label : undefined);
      this.change(value);
    }
