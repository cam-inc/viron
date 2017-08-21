// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotVideo = Quill.import('formats/video');

class BlotVideo extends QuillBlotVideo {
}

export default BlotVideo;
