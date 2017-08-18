import marked from 'marked';
import ObjectAssign from 'object-assign';

const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  return `<div class="Markdown__heading Markdown__heading--level${level}">${text}</div>`;
},
renderer.paragraph = text => {
  return `<div class="Markdown__paragraph">${text}</div>`;
},
renderer.strong = text => {
  return `<span class="Markdown__strong">${text}</span>`;
},
renderer.em = text => {
  return `<span class="Markdown__emphasis">${text}</span>`;
},
renderer.del = text => {
  return `<span class="Markdown__delete">${text}</span>`;
},
renderer.list = (body, ordered) => {
  if(ordered){
    return `<ol class="Markdown__list Markdown__list--ordered">${body}</ol>`;
  }else{
    return `<ul class="Markdown__list Markdown__list--unordered">${body}</ul>`;
  }
},
renderer.listitem = text => {
  return `<li class="Markdown__listitem">${text}</li>`;
},
renderer.code = code => {
  return `<div class="Markdown__code"><pre><code>${code}</code></pre></div>`;
},
renderer.codespan = code => {
  return `<span class="Markdown__codespan"><code>${code}</code></span>`;
},
renderer.html = html => {
  return html;
},
renderer.hr = () => {
  return '<div class="Markdown__horizontalRule"></div>';
},
renderer.br = () => {
  return '<br>';
},
renderer.blockquote = quote => {
  return `<div class="Markdown__blockquote">${quote}</div>`;
},
renderer.link = (href, title, text) => {
  if(title){
    return `<a class="Markdown__link" href="${href}" title="${title}">${text}</a>`;
  }else{
    return `<a class="Markdown__link" href="${href}">${text}</a>`;
  }
},
renderer.image = (href, title, text) => {
  if(title){
    return `<img class="Markdown__image" src="${href}" alt="${text}" title="${title}"></img>`;
  }else{
    return `<img class="Markdown__image" src="${href}" alt="${text}"></img>`;
  }
},
renderer.table = (header, body) => {
  return `<table class="Markdown__table"><thead>${header}</thead><tbody class="Markdown__tableBody">${body}</tbody></table>`;
},
renderer.tablerow = content => {
  return `<tr class="Markdown__tableRow">${content}</tr>`;
},
renderer.tablecell = (content, flags) => {
  if(flags.header){
    return `<th class="Markdown__tableHeader">${content}</th>`;
  }else{
    return `<td class="Markdown__tableCell Markdown__tableCell--${flags.align}">${content}</td>`;
  }
};

export default function() {
  marked.setOptions(ObjectAssign(
    {
      renderer: renderer,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    },
    this.opts.data.markedOptions
  ));
  this.on('mount', () => {
    this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
