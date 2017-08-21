// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassAlign = Quill.import('attributors/class/align');
const QuillAttributorStyleAlign = Quill.import('attributors/style/align');

export {
  QuillAttributorClassAlign as AttributorClassAlign,
  QuillAttributorStyleAlign as AttributorStyleAlign
};
