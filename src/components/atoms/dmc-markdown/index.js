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
      return `<div class="Markdown__text Markdown__text--paragraph">${text}</div>`;
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
      return `<div class="Markdown__link"><a href="${href}" title="${title}">${text}</a></div>`;
    },
    // // imageタグ
    // renderer.image = (href, title, text) => {
    //   return `<div class="Markdown__image">${text}</div>`;
    // },
    // // tableタグ
    // renderer.table = (header, body) => {
    //   return `<div class="Markdown__text--blockquote">${body}</div>`;
    // },
    // // tablerow
    // renderer.tablerow = (content) => {
    //   return `<div class="Markdown__text--blockquote">${content}</div>`;
    // },
    // // tablecell
    // renderer.tablecell = (content) => {
    //   return `<div class="Markdown__text--blockquote">${content}</div>`;
    // },
    this.refs.view.innerHTML = this.opts.data.content ? marked('# 見出しh1  \n## 見出しh2  \n### 見出しh3  \n#### 見出しh4  \n##### 見出しh5\n###### 見出しh6\nparagraph **strong** ***emphasis***\n```javascript\nif(){}else\n```\n~~delete~~\n1. list\n2. list\n---\n\n> blockquote1\n\n> blockquote2\n\n> blockquote3', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
