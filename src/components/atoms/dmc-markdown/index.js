import marked from 'marked';
import ObjectAssign from 'object-assign';
export default function() {

  this.on('update', () => {

    var renderer = new marked.Renderer();

    renderer.heading = (text, level) => {
      var text = text.replace(/[^\w]+/g, '-');
      return '<div class="wrapper">' + '<h' + level + '>' + text + '</h' + level + '>' + '</div>';
    },
    this.refs.view.innerHTML = this.opts.data.content ? marked('# Marked in browser\n\nRendered by **marked**.', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
