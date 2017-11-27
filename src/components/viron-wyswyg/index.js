import ObjectAssign from 'object-assign';

// TODO: Froalaを購入すること。
// Froala WYSWYG EditorがjQuery依存。
// jQuery使いたくないけど、Froalaは使いたいので仕方なく。
const $ = window.$;
// Froalaエディタのオプション群。
const defaultEditorOptions = {
  // 文字数カウンタを非表示に。
  charCounterCount: false
};

export default function() {
  this.on('mount', () => {
    $(this.refs.editor).froalaEditor(ObjectAssign({}, defaultEditorOptions, {
      // 上書きするならここに。
    }));
  });
}
