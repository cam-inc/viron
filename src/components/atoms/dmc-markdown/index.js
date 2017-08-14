import marked from 'marked';
export default function() {

  this.on('update', () => {
    var renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
      return `<div class="Markdown--h${level}">${text}</div>`;
    },
    renderer.paragraph = (text) => {
      return `<div class="Markdown--p">${text}</div>`;
    },
    renderer.list = (text, ordered) => {
      return `<div class="Markdown--ul">${text}</div>`;
    },
    renderer.listitem = (text) => {
      return `<div class="Markdown--li">${text}</div>`;
    },
    this.refs.view.innerHTML = this.opts.data.content ? marked('# Marked in browser\n\nRendered by **marked**.\n\n - aaaaaa', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
