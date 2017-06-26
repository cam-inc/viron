export default function() {
  this.isUseBody = false;
  // "query", "header", "path", "formData" or "body"のどれか。
  if (this.opts.parameter.in === 'body') {
    this.isUseBody = true;
  }

  this.handleChange = (key, value) => {
    this.opts.onchange(key, value);
  };
}
