export default function() {
  this.handleActionButtonPat = id => {
    this.opts.actions[id].onPat(this.opts.actions[id].id, this.opts.actions[id].rowData.getValue(this.opts.idx));
    this.close();
  };
}
