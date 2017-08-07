export default function() {
  this.date = this.opts.date.date;
  this.handleTap = () => {
    this.opts.oncellpat(this.date);
  };
}