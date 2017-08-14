import marked from 'marked';
export default function() {

  this.on('update', () => {
    var renderer = new marked.Renderer();

    renderer.heading = (text, level) => {
      return `<div class="Markdown__text Markdown__text--h${level}">${text}</div>`;
    },

    renderer.paragraph = (text) => {
      return `<div class="Markdown__text Markdown__text--p">${text}</div>`;
    },

    renderer.strong = (text) => {
      return `<div class="Markdown__text Markdown__text--strong">${text}</div>`;
    },

    renderer.em = (text) => {
      return `<div class="Markdown__text--em">${text}</div>`;
    },

    renderer.del = (text) => {
      return `<div class="Markdown__text--del">${text}</div>`;
    },

    renderer.list = (text, ordered) => {
      if(ordered === 'true'){
        return `<div class="Markdown__list--ol">${text}</div>`;
      }else{
        return `<div class="Markdown__list--ul">${text}</div>`;
      }
    },

    renderer.listitem = (text) => {
      return `<div class="Markdown__text--listItem">${text}</div>`;
    },

    renderer.blockquote = (quote) => {
      return `<div class="Markdown__text--blockquote">${quote}</div>`;
    },

    renderer.codespan = (code) => {
      return `<div class="Markdown__text--listItem">${code}</div>`;
    },

    renderer.hr = () => {
      return `<div class="Markdown--hr"></div>`;
    },

    renderer.br = () => {
      return `<div class="Markdown--br"></div>`;
    },
    this.refs.view.innerHTML = this.opts.data.content ? marked('# Marked in browser\n\nRendered by **marked**.\n\n - aaaaaa', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
