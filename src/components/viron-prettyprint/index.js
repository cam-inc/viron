export default function() {
  const updateText = () => {
    const json = JSON.stringify(this.opts.data, undefined, 4);
    let text = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="Prettyprint__' + cls + '">' + match + '</span>';
    });
    this.refs.canvas.innerHTML = text;
  };

  this.on('mount', () => {
    updateText();
  }).on('updated', () => {
    updateText();
  });
}
