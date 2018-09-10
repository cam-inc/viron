import throttle from 'mout/function/throttle';
import ObjectAssign from 'object-assign';
import TinyMCE from 'tinymce';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/hr/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/textcolor/plugin';
import './explorer/index.tag';

const url = new URL(window.location.href);
const toolbarDesktop = [
  'bold italic underline | forecolor backcolor | image explorer link unlink',
  'formatselect fontsizeselect',
  'alignleft aligncenter alignright alignjustify alignnone | bullist numlist | outdent indent blockquote'
];
const toolbarMobile = [
  'bold italic underline forecolor backcolor',
  'image explorer link unlink',
  'alignleft aligncenter alignright alignjustify alignnone',
  'bullist numlist | outdent indent blockquote'
];
const menuDesktop = {
  edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
  insert: { title: 'Insert', items: 'image link | inserttable hr' },
  format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | removeformat' },
  tools: { title: 'Tools', items: 'code fullscreen' }
};
const menuMobile = {};
const baseConfig = {
  plugins: ['code', 'hr', 'lists', 'link', 'image', 'paste', 'searchreplace', 'fullscreen', 'table', 'textcolor'],
  fontsize_formats: '8pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt',
  min_height: 300,
  branding: false,
  relative_urls: false,
  remove_script_host: true,
  document_base_url: `${url.origin}${url.pathname}tinymce`,
  skin: 'lightgray',
  skin_url: 'skins/lightgray',
  theme: 'modern',
  theme_url: 'themes/modern/theme.js',
  body_class: 'Wyswyg__body'
};

export default function() {
  const store = this.riotx.get();
  const isMobile = store.getter('layout.isMobile');

  this.editor = null;

  const openExplorer = () => {
    const explorerDef = this.opts.explorer;
    store.action('drawers.add', 'viron-wyswyg-explorer', {
      def: explorerDef,
      onInsert: item => {
        this.editor.execCommand('mceInsertContent', false, `<img src="${item.url}" width="100%" />`);
      }
    }, { isWide: true });
  };

  const customConfig = {
    selector: `.Wyswyg__editor${this._riot_id}`,
    init_instance_callback: editor => {
      this.editor = editor;
      !!this.opts.val && this.editor.setContent(this.opts.val);
      this.editor.on('Change', this.handleEditorChange);
      this.editor.on('NodeChange', this.handleEditorChange);
      this.editor.on('focus', this.handleEditorFocus);
      this.editor.on('blur', this.handleEditorBlur);
    },
    setup: editor => {
      // explorer機能と連携。
      if (!!this.opts.explorer) {
        editor.addButton('explorer', {
          icon: 'browse',
          tooltip: 'Explorer',
          onclick: () => {
            editor.iframeElement.blur();
            // blur完了を保証するため。
            setTimeout(() => {
              openExplorer();
            }, 500);

          }
        });
      }
    },
    menu: (() => {
      if (isMobile) {
        return menuMobile;
      }
      return menuDesktop;
    })(),
    toolbar: (() => {
      if (isMobile) {
        return toolbarMobile;
      }
      return toolbarDesktop;
    })()
  };

  this.on('mount', () => {
    if (this.opts.ispreview) {
      return;
    }
    TinyMCE.init(ObjectAssign({}, baseConfig, customConfig));
  }).on('before-unmount', () => {
    if (this.opts.ispreview) {
      return;
    }
    TinyMCE.remove(`.Wyswyg__editor${this._riot_id}`);
    if (!!this.editor) {
      this.editor.off('Change', this.handleEditorChange);
      this.editor.off('NodeChange', this.handleEditorChange);
      this.editor.off('focus', this.handleEditorFocus);
      this.editor.off('blur', this.handleEditorBlur);
      // destroy時にエラーが発生する。TinyMCEの対応待ち。
      // @see: https://github.com/tinymce/tinymce/issues/3765
      this.editor.destroy();
      this.editor = null;
    }
  });

  // 発火回数を間引く。
  this.handleEditorChange = throttle(() => {
    if (!this.opts.onchange) {
      return;
    }
    const html = this.editor.getContent();
    this.opts.onchange(html);
  }, 500);

  this.handleEditorFocus = () => {
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleEditorBlur = () => {
    if (!!this.opts.onchange) {
      const html = this.editor.getContent();
      this.opts.onchange(html);
    }
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
