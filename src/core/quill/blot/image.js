// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotImage = Quill.import('formats/image');

class BlotImage extends QuillBlotImage {
}

export default BlotImage;
