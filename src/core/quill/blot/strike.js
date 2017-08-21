// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotStrike = Quill.import('formats/strike');

class BlotStrike extends QuillBlotStrike { }

export default BlotStrike;
