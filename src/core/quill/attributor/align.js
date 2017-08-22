// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassAlign = Quill.import('attributors/class/align');
const QuillAttributorStyleAlign = Quill.import('attributors/style/align');

// デフォルトでstyle属性を使用する。
Quill.register(QuillAttributorStyleAlign, true);

export {
  QuillAttributorClassAlign as AttributorClassAlign,
  QuillAttributorStyleAlign as AttributorStyleAlign
};
