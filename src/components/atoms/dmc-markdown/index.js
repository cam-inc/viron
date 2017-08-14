import marked from 'marked';
export default function() {

  this.on('update', () => {
    var renderer = new marked.Renderer();
    // hタグ
    renderer.heading = (text, level) => {
      return `<div class="Markdown__text Markdown__text--h${level}">${text}</div>`;
    },
    // pタグ
    renderer.paragraph = (text) => {
      return `<div class="Markdown__text Markdown__text--p">${text}</div>`;
    },
    // strongタグ
    renderer.strong = (text) => {
      return `<div class="Markdown__text Markdown__text--strong">${text}</div>`;
    },
    // emタグ
    renderer.em = (text) => {
      return `<div class="Markdown__text--em">${text}</div>`;
    },
    // delタグ
    renderer.del = (text) => {
      return `<div class="Markdown__text--del">${text}</div>`;
    },
    // ulタグ
    renderer.list = (text, ordered) => {
      if(ordered === 'true'){
        return `<div class="Markdown__list--ol">${text}</div>`;
      }else{
        return `<div class="Markdown__list--ul">${text}</div>`;
      }
    },
    // liタグ
    renderer.listitem = (text) => {
      return `<div class="Markdown__text--listItem">${text}</div>`;
    },
    // 引用
    renderer.blockquote = (quote) => {
      return `<div class="Markdown__text--blockquote">${quote}</div>`;
    },
    // codeタグ
    renderer.codespan = (code) => {
      return `<div class="Markdown__text--listItem">${code}</div>`;
    },
    // hrタグ
    renderer.hr = () => {
      return '<div class="Markdown--hr"></div>';
    },
    // brタグ
    renderer.br = () => {
      return '<div class="Markdown--br"></div>';
    },

    this.refs.view.innerHTML = this.opts.data.content ? marked('# Marked in browser\n\nRendered by **marked**.\n\n - aaaaaa', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
