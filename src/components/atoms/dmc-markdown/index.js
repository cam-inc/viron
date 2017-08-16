import marked from 'marked';
import ObjectAssign from 'object-assign';

const renderer = new marked.Renderer();

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

    renderer.heading = (text, level) => {
      return `<div class="Markdown__heading Markdown__heading--level${level}">${text}</div>`;
    },

    renderer.paragraph = text => {
      return `<div class="Markdown__text Markdown__paragraph">${text}</div>`;
    },

    renderer.strong = text => {
      return `<div class="Markdown__text Markdown__strong">${text}</div>`;
    },

    renderer.em = text => {
      return `<div class="Markdown__text Markdown__emphasis">${text}</div>`;
    },

    renderer.del = text => {
      return `<div class="Markdown__text Markdown__delete">${text}</div>`;
    },

    renderer.list = (body, ordered) => {
      if(ordered){
        return `<div class="Markdown__list--ordered">${body}</div>`;
      }else{
        return `<div class="Markdown__list--unordered">${body}</div>`;
      }
    },

    renderer.listitem = text => {
      return `<div class="Markdown__listitem">${text}</div>`;
    },

    renderer.code = (code, language) => {
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
      return `<a class="Markdown__link" href="${href}" title="${title}">${text}</a>`;
    },

    renderer.image = (href, title, text) => {
      return `<img class="Markdown__image" src="${href}" alt="${text}" title="${title}"></img>`;
    },

    renderer.table = (header, body) => {
      return `<table class="Markdown__table"><thead>${header}</thead><tbody>${body}</tbody></table>`;
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
    },
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content, { renderer: renderer }) : '';

    this.refs.view.innerHTML = this.opts.data.content ? marked('# 見出しh1  \n## 見出しh2  \n### 見出しh3  \n#### 見出しh4  \n##### 見出しh5\n###### 見出しh6\nparagraph **strong** ***emphasis*** ~~delete~~\n```javascript\nif(i = 0){\n\tvar i = 0;\n}else{\n}\n\n```\n\n`<test a="` content of attribute `">`\n\n<h1>aaa</h1>\n\n1. list\n\t1. list\n1. list\n\n\n\n- list\n- list \n---\n\n Header 1|Header 2|Header 3|Header 4 \n :-------|:------:|-------:|-------- \n Cell 1  |Cell 2  |Cell 3  |Cell 4 \n *Cell 5*|Cell 6  |Cell 7  |Cell 8 \n\n\n\n Header 1|Header 2|Header 3|Header 4 \n :-------|:------:|-------:|-------- \n Cell 1  |Cell 2  |Cell 3  |Cell 4 \n *Cell 5*|Cell 6  |Cell 7  |Cell 8 \n\n> blockquote1\n\n>> blockquote2\n\n> blockquote3\n\n[Google](https://www.google.co.jp/)\n\n![豆](https://releaf.pfavill.com/Ms_Flont2/img/vesi/ingenmame.png)', { renderer: renderer }) : '';
  });
}
