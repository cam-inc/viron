export default function() {
  this.handleActionButtonPat = e => {
    const idx = e.target.getAttribute('idx');
    this.opts.actions[idx].onPat(this.opts.actions[idx].operationId, this.opts.idx);
    this.close();
  };
}
