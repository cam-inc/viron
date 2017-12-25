import throttle from 'mout/function/throttle';
import ObjectAssign from 'object-assign';
import TinyMCE from 'tinymce';
import 'tinymce/plugins/anchor/plugin';
import 'tinymce/plugins/charmap/plugin';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/directionality/plugin';
import 'tinymce/plugins/emoticons/plugin';
import 'tinymce/plugins/fullpage/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/help/plugin';
import 'tinymce/plugins/hr/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/imagetools/plugin';
import 'tinymce/plugins/insertdatetime/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/nonbreaking/plugin';
import 'tinymce/plugins/pagebreak/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/print/plugin';
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/template/plugin';
import 'tinymce/plugins/textcolor/plugin';
import 'tinymce/plugins/toc/plugin';

const url = new URL(window.location.href);
const baseConfig = {
  menubar: 'file edit view',
  menu: {
    edit: { title: 'Edit', items: 'cut, copy, paste' },
    view: { title: 'View', items: 'table, tabledelete, tablecellprops, tablemergecells, tablesplitcells, tableinsertrowbefore, tableinsertrowafter, tabledeleterow, tablerowprops, tablecutrow, tablecopyrow, tablepasterowbefore, tablepasterowafter, tableinsertcolbefore, tableinsertcolafter, tabledeletecol' }
  },
  toolbar: [
    'newdocument | bold italic underline strikethrough',
    'alignleft aligncenter alignright | alignjustify alignnone',
    'styleselect formatselect fontselect fontsizeselect',
    'outdent indent | blockquote',
    'undo redo removeformat subscript superscript insert',
    'code hr bullist numlist | link unlink openlink',
    'image | charmap pastetext print preview anchor pagebreak searchreplace',
    'help fullscreen insertdatetime media nonbreaking',
    'rotateleft rotateright flipv fliph editimage imageoptions | fullpage',
    'ltr rtl | emoticons template | forecolor backcolor | toc'
  ],
  plugins: ['code', 'hr', 'lists', 'link', 'image', 'charmap', 'paste', 'print', 'preview', 'anchor', 'pagebreak', 'searchreplace', 'help', 'fullscreen', 'insertdatetime', 'media', 'nonbreaking', 'table', 'imagetools', 'fullpage', 'directionality', 'emoticons', 'template', 'textcolor', 'toc'],
  min_height: 300,
  branding: false,
  relative_urls : false,
  remove_script_host : true,
  document_base_url : `${url.origin}${url.pathname}tinymce`,
  skin: 'lightgray',
  skin_url: 'skins/lightgray',
  theme: 'modern',
  theme_url: 'themes/modern/theme.js',
  body_class: 'Wyswyg__body',
  mobile: {
    theme: 'mobile',
    theme_url: 'themes/mobile/theme.js'
  }
};

export default function() {
  this.editor = null;

  this.on('mount', () => {
    TinyMCE.init(ObjectAssign({}, baseConfig, {
      target: this.refs.editor,
      selector: `.Wyswyg__editor${this._riot_id}`,
      init_instance_callback: editor => {
        this.editor = editor;
        this.editor.on('Change', this.handleEditorChange);
        this.editor.on('focus', this.handleEditorFocus);
        this.editor.on('blur', this.handleEditorBlur);
      }
    }));
  }).on('before-unmount', () => {
    this.editor.off('Change', this.handleEditorChange);
    this.editor.off('focus', this.handleEditorFocus);
    this.editor.off('blur', this.handleEditorBlur);
    this.editor.destroy();
    this.editor = null;
  });

  // 発火回数を間引く。
  this.handleEditorChange = throttle(() => {
    if (!this.opts.onchange) {
      return;
    }
    const html = this.editor.getContent();
    this.opts.onchange(html);
  }, 1000);

  this.handleEditorFocus = () => {
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleEditorBlur = () => {
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
