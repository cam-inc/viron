import marked from 'marked';
import ObjectAssign from 'object-assign';
export default function() {

  this.on('update', () => {
    marked.setOptions(ObjectAssign({}, {
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    }, this.opts.data.markedOptions));

    this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  })
}
