export default function() {
  this.root.innerHTML = this.opts.content;

  this.on('updated', () => {
    this.root.innerHTML = this.opts.content;
  });
}
