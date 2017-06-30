import storage from 'store';

// ローカルに保存されているエンドポイント一覧。
export default storage.get('endpoints', {});
