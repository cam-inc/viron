import marked from 'marked';
export default function() {

  this.on('update', () => {
    var renderer = new marked.Renderer();
    // heading
    renderer.heading = (text, level) => {
      return `<div class="Markdown__heading Markdown__heading--level${level}">${text}</div>`;
    },
    // paragraph
    renderer.paragraph = text => {
      return `<div class="Markdown__text Markdown__textParagraph">${text}</div>`;
    },
    // strong
    renderer.strong = text => {
      return `<div class="Markdown__text Markdown__text--strong">${text}</div>`;
    },
    // emphasis
    renderer.em = text => {
      return `<div class="Markdown__text Markdown__text--emphasis">${text}</div>`;
    },
    // delete
    renderer.del = text => {
      return `<div class="Markdown__text Markdown__text--delete">${text}</div>`;
    },
    // ul/ol
    renderer.list = (body, ordered) => {
      if(ordered === true){
        return `<div class="Markdown__list--ordered">${body}</div>`;
      }else if(ordered === false){
        return `<div class="Markdown__list--unordered">${body}</div>`;
      }
    },
    // list
    renderer.listitem = text => {
      return `<div class="Markdown__listItem">${text}</div>`;
    },
    // code
    renderer.code = (code, language) => {
      return `<div class="Markdown__code"><pre><code class="language-${language}">${code}</code></pre></div>`;
    },
    renderer.codespan = code => {
      return `<div class="Markdown__codespan"><p><code>${code}</code></p></div>`;
    },
    renderer.html = html => {
      return html;
    },
    // hr
    renderer.hr = () => {
      return '<div class="Markdown__horizontalRule"></div>';
    },
    // br
    renderer.br = () => {
      return '<br>';
    },
    // blockquote
    renderer.blockquote = quote => {
      return `<div class="Markdown__blockquote">${quote}</div>`;
    },
    // link
    renderer.link = (href, title, text) => {
      return `<a class="Markdown__link" href="${title}">${text}</a>`;
    },
    // image
    renderer.image = (src, title, text) => {
      return `<img class="Markdown__image" src="${src}" alt="${text}" title="${title}"></img>`;
    },
    // table
    renderer.table = (header, body) => {
      return `<table class="Markdown__table"><thead>${header}</thead>${body}</table>`;
    },
    // tablerow
    renderer.tablerow = content => {
      return `<tr class="Markdown__tableRow">${content}</tr>`;
    },
    // tablecell
    renderer.tablecell = (content, flags) => {
      if(flags.header === true){
        return `<td class="Markdown__tableHeader">${content}</td>`;
      }else if(flags.header === false){
        return `<td class="Markdown__tableCell Markdown__tableCell--${flags.align}">${content}</td>`;
      }
    },
    this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content, { renderer: renderer }) : '';
  });
}
