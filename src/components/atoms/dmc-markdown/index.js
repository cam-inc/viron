import marked from 'marked';
export default function() {

  this.on('update', () => {
    var renderer = new marked.Renderer();
    // hタグ
    renderer.heading = (text, level) => {
      return `<div class="Markdown__heading Markdown__heading--level${level}">${text}</div>`;
    },
    // pタグ
    renderer.paragraph = (text) => {
      return `<div class="Markdown__text Markdown__textParagraph">${text}</div>`;
    },
    // strongタグ
    renderer.strong = (text) => {
      return `<div class="Markdown__text Markdown__text--strong">${text}</div>`;
    },
    // emタグ
    renderer.em = (text) => {
      return `<div class="Markdown__text Markdown__text--emphasis">${text}</div>`;
    },
    // delタグ
    renderer.del = (text) => {
      return `<div class="Markdown__text Markdown__text--delete">${text}</div>`;
    },
    // ulタグ
    renderer.list = (body, ordered) => {
      if(ordered === true){
        return `<div class="Markdown__list--ordered">${body}</div>`;
      }else if(ordered === false){
        return `<div class="Markdown__list--unordered">${body}</div>`;
      }
    },
    // liタグ
    renderer.listitem = (text) => {
      return `<div class="Markdown__listItem">${text}</div>`;
    },
    // codeタグ
    renderer.code = (code, language) => {
      return `<div class="Markdown__code"><pre><code class="language-${language}">${code}</code></pre></div>`;
    },
    // hrタグ
    renderer.hr = () => {
      return '<div class="Markdown__horizontalRule"></div>';
    },
    // brタグ
    renderer.br = () => {
      return '<br>';
    },
    // 引用
    renderer.blockquote = (quote) => {
      return `<div class="Markdown__blockquote">${quote}</div>`;
    },
    // linkタグ
    renderer.link = (href, title, text) => {
      return `<a class="Markdown__link" href="${title}">${text}</a>`;
    },
    // imageタグ
    renderer.image = (src, title, text) => {
      return `<img class="Markdown__image" src="${src}" href="${text}" title="${title}"></img>`;
    },
    // tableタグ
    renderer.table = (header, body) => {
      return `<table class="Markdown__table"><thead>${header}</thead>${body}</table>`;
    },
    // tablerow
    renderer.tablerow = (content) => {
      return `<tr class="Markdown__tableRow">${content}</tr>`;
    },
    // tablecell
    renderer.tablecell = (content, flags) => {
      if(flags.header === true){
        return `<td class="Markdown__tableHeader">${content}</td>`;
      }else if(flags.header === false){
        return `<td class="Markdown__tableCell" style="text-align: ${flags.align}">${content}</td>`;
      }
    },
    this.refs.view.innerHTML = this.opts.data.content ? marked('# 見出しh1  \n## 見出しh2  \n### 見出しh3  \n#### 見出しh4  \n##### 見出しh5\n###### 見出しh6\nparagraph **strong** ***emphasis***\n```javascript\nif(){}else\n```\n~~delete~~\n- list\n- list\n---\n\n Header 1|Header 2|Header 3|Header 4 \n :-------|:------:|-------:|-------- \n Cell 1  |Cell 2  |Cell 3  |Cell 4 \n *Cell 5*|Cell 6  |Cell 7  |Cell 8 \n\n> blockquote1\n\n>> blockquote2\n\n> blockquote3\n\n[Google](https://www.google.co.jp/)\n\n![豆](https://releaf.pfavill.com/Ms_Flont2/img/vesi/ingenmame.png)', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
