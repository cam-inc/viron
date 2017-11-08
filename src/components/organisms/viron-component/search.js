import ObjectAssign from 'object-assign';

export default function() {
  this.currentParameters = ObjectAssign({}, this.opts.initialParameters);

  this.handleParametersChange = newParameters => {
    this.currentParameters = newParameters;
    this.update();
  };

  this.handleSubmitButtonClick = () => {
    this.opts.onComplete(this.currentParameters);
    this.close();
  };
}
