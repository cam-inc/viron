dmc-prettyprint.PrettyPrint
  pre.PrettyPrint__pre(ref="canvas")

  script.
    const str = (function(json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
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
        return '<span class="PrettyPrint__' + cls + '">' + match + '</span>';
      });
    })(JSON.stringify(this.opts.data, undefined, 4));

    this.on('mount', () => {
      this.refs.canvas.innerHTML = str;
    });
