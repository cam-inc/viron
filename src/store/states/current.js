import storage from 'store';

// 選択されているエンドポイント。
export default storage.get('current', null);
