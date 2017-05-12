dmc-operation.Operation
  .Operation__parameters
    dmc-operation-parameter(each="{ parameter in opts.operation.parameters }" parameter="{ parameter }" parameterValue="{ parent.queries[parameter.name] }" onChange="{ parent.handleParameterChange }")
  .Operation__control
    dmc-button(label="{ opts.operation.operationId }" onClick="{ handleExecuteButtonClick }")
    dmc-button(label="cancel" type="secondary" onClick="{ handleCancelButtonClick }")

  script.
    import ObjectAssign from 'object-assign';
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    this.queries = ObjectAssign({}, this.opts.initialQueries);

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
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
        .then(() => store.action(constants.ACTION_COMPONENT_OPERATE, this.opts.operation, this.queries))
        .then(() => {
          this.closeModal();
          this.opts.onSuccess();
        })
        .catch(err => store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message
        }));
    }

    handleCancelButtonClick() {
      this.closeModal();
    }

dmc-operation-parameter.Operation__parameter
  .Operation__parameterHead
    .Operation__parameterName { opts.parameter.name }
    .Operation__parameterRequired(if="{ opts.parameter.required }") required
  .Operation__parameterBody
    dmc-operation-schema(if="{ isUseBody }" name="{ opts.parameter.name}" schema="{ opts.parameter.schema }" parameterValues="{ opts.parametervalue }" onChange="{ handleChange }")
    dmc-operation-input(if="{ !isUseBody }" parameterObject="{ this.opts.parameter }" parameterValue="{ opts.parametervalue }" onChange="{ handleChange }")

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
  dmc-operation-input(each="{ propertyKey in propertyKeys }" parameterObject="{ parent.getParameterObject(propertyKey) }" parameterValue="{ parent.getValue(propertyKey) }" onChange="{ parent.handleChange }")

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

dmc-operation-input.Operation__input
  .Operation__inputName { opts.parameterobject.name }({ opts.parameterobject.type }){ opts.parameterobject.required ? '(required)' : '' }
  virtual(if="{ uiType === 'input' }")
    dmc-input(text="{ opts.parametervalue }" onTextChange="{ handleInputChange }")
  virtual(if="{ uiType === 'checkbox' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onChange="{ handleCheckboxChange }")
  virtual(if="{ uiType === 'select' }")
    dmc-select(isOpened="{ isOpened }" options="{ getSelectOptions() }" onToggle="{ handleSelectToggle }" onChange="{ handleSelectChange }")

  script.
    import { find, forEach } from 'mout/array';
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
