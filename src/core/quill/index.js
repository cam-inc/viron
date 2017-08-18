// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

// style属性ではなくclass属性を使う。
// @see: https://quilljs.com/guides/how-to-customize-quill/#class-vs-inline
const ClassAttributorAlign = Quill.import('attributors/class/align');
const ClassAttributorBackground = Quill.import('attributors/class/background');
const ClassAttributorColor = Quill.import('attributors/class/color');
const ClassAttributorDirection = Quill.import('attributors/class/direction');
const ClassAttributorFont = Quill.import('attributors/class/font');
const ClassAttributorSize = Quill.import('attributors/class/size');
Quill.register(ClassAttributorAlign, true);
Quill.register(ClassAttributorBackground, true);
Quill.register(ClassAttributorColor, true);
Quill.register(ClassAttributorDirection, true);
Quill.register(ClassAttributorFont, true);
Quill.register(ClassAttributorSize, true);

/**
 * @param {Element} editor
 * @param {*} args
 * @return {Quill}
 */
const create = (editor, ...args) => {
  return new Quill(editor, ...args);
};

/**
 * 指定Blotを書き換えます。
 * @param {String} blotName
 * @param {Object} params
 */
const customizeBlot = (blotName, params) => {
  const TargetBlot = Quill.import(`formats/${blotName}`);
  if (!TargetBlot) {
    return;
  }
  if (!!params.tagName) {
    TargetBlot.tagName = params.tagName;
  }
  if (!!params.className) {
    TargetBlot.className = params.className;
  }
  Quill.register(TargetBlot, true);
};

export default {
  create,
  customizeBlot
};
