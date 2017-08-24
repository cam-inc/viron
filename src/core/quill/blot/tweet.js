// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

const QuillBlotBlockEmbed = Quill.import('blots/block/embed');

class BlotTweet extends QuillBlotBlockEmbed {
  static create(id) {
    const node = super.create();
    node.dataset.id = id;
    // TODO: twttr読み込み。
    //twttr.widgets.createTweet(id, node);
    return node;
  }

  static value(node) {
    return node.dataset.id;
  }
}

BlotTweet.blotName = 'myTweet';
BlotTweet.tagName = 'div';
BlotTweet.className = 'tweet';

export default BlotTweet;
