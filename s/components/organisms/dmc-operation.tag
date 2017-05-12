dmc-operation.Operation
  div i am operation
  .Operation__control
    dmc-button(label="{ opts.operation.operationId }" onClick="{ handleExecuteButtonClick }")
    dmc-button(label="cancel" type="secondary" onClick="{ handleCancelButtonClick }")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    // TODO: debug
    this.queries = {
      payload: this.opts.operation.parameters[0].schema.example
    };

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleExecuteButtonClick() {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_COMPONENT_OPERATE, this.opts.operation, this.queries))
        .then(() => {
          debugger;
        })
        .catch(err => {
          debugger;
        });
    }

    handleCancelButtonClick() {
      this.closeModal();
    }
