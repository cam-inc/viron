import ObjectAssign from 'object-assign';

export default function() {
  this.currentParameters = ObjectAssign({}, this.opts.initialParameters);

  this.handleParametersChange = newParameters => {
    this.currentParameters = newParameters;
    this.update();
  };

  this.handleSubmitButtonPat = () => {
    Promise
      .resolve()
      .then(() => {
        // TODO: execute api;
      })
      .then(() => {
        this.opts.onComplete();
        this.close();
      });
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
