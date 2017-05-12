dmc-operation.Operation
  .Operation__parameters
    dmc-operation-parameter(each="{ parameter in opts.operation.parameters }" parameter="{ parameter }" parameterValue="{ parent.queries[parameter.name] }" onChange="{ parent.handleParameterChange }")
  .Operation__control
    dmc-button(label="{ opts.operation.operationId }" onClick="{ handleExecuteButtonClick }")
    dmc-button(label="cancel" type="secondary" onClick="{ handleCancelButtonClick }")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    this.queries = {};

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleParameterChange(key, value) {
      this.queries[key] = value;
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
    import ObjectAssign from 'object-assign';

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
      this.opts.onchange(this.opts.name, values);
    }

dmc-operation-input.Operation__input
  .Operation__inputName { opts.parameterobject.name }{ opts.parameterobject.required ? '(required)' : '' }
  virtual(if="{ opts.parameterobject.type === 'string' }")
    dmc-input(text="{ opts.parametervalue }" onTextChange="{ handleInputChange }")
  virtual(if="{ opts.parameterobject.type === 'number' }")
    dmc-input(text="{ opts.parametervalue }" onTextChange="{ handleInputChange }")
  virtual(if="{ opts.parameterobject.type === 'integer' }")
    dmc-input(text="{ opts.parametervalue }" onTextChange="{ handleInputChange }")
  virtual(if="{ opts.parameterobject.type === 'boolean' }")
    dmc-checkbox(isChecked="{ opts.parametervalue }" onClick="{ handleCheckboxClick }")
  virtual(if="{ opts.parameterobject.type === 'array' }")
    div array
  virtual(if="{ opts.parameterobject.type === 'file' }")
    div file

  script.
    import '../atoms/dmc-checkbox.tag';
    import '../atoms/dmc-input.tag';

    handleInputChange(value) {
      // TODO: validate
      switch (this.opts.parameterobject.type) {
        case 'number':
        case 'integer':
          value = Number(value);
          break;
        default:
          break;
      }
      this.opts.onchange(this.opts.parameterobject.name, value);
    }

    handleCheckboxClick(isChecked) {
      this.opts.onchange(this.opts.parameterobject.name, isChecked);
    }
