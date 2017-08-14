import marked from 'marked';
import ObjectAssign from 'object-assign';
export default function() {

  this.on('update', () => {
    // marked.setOptions(ObjectAssign({}, {
    //   renderer: new marked.Renderer(),
    //   gfm: true,
    //   tables: true,
    //   breaks: false,
    //   pedantic: false,
    //   sanitize: false,
    //   smartLists: true,
    //   smartypants: false
    // }, this.opts.data.markedOptions));
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
      return `<div class="Markdown__listItem">${text}</div>`;
    },
    // // linkタグ
    // renderer.link = (href, title, text) => {
    //   return `<div class="Markdown__text--listItem"><a href="${href}" title="${title}">${text}</a></div>`;
    // },
    // // imageタグ
    // renderer.image = (href, title, text) => {
    //   return `<div class="Markdown__text--listItem">${text}</div>`;
    // },
    // 引用
    renderer.blockquote = (quote) => {
      return `<div class="Markdown__blockquote">${quote}</div>`;
    },
    // codeタグ
    renderer.codespan = (code) => {
      return `<div class="Markdown__code">${code}</div>`;
    },
    // hrタグ
    renderer.hr = () => {
      return '<div class="Markdown--hr"></div>';
    },
    // brタグ
    renderer.br = () => {
      return '<div class="Markdown--br"></div>';
    },
    // // tableタグ
    // renderer.table = (header, body) => {
    //   return `<div class="Markdown__text--blockquote">${quote}</div>`;
    // },
    // // tablerow
    // renderer.tablerow = (content) => {
    //   return `<div class="Markdown__text--blockquote">${quote}</div>`;
    // },
    // // tablecell
    // renderer.tablecell = (content) => {
    //   return `<div class="Markdown__text--blockquote">${quote}</div>`;
    // },

    console.log(marked('# 見出しh1\n\n## 見出しh2\n\n### 見出しh3\n\n#### 見出しh4\n\n##### 見出しh5\n\n###### 見出しh6\n\nparagraph **strong**\n\n- list', { renderer: renderer }));
    this.refs.view.innerHTML = this.opts.data.content ? marked('# 見出しh1\n\n## 見出しh2\n\n### 見出しh3\n\n#### 見出しh4\n\n##### 見出しh5\n\n###### 見出しh6\n\nparagraph \n\n**strong**\n\n- list\n\n- list', { renderer: renderer }) : '';
    // this.refs.view.innerHTML = this.opts.data.content ? marked(this.opts.data.content) : '';
  });
}
