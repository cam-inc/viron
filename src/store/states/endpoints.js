import storage from 'store';
import exporter from './exporter';

// ローカルに保存されているエンドポイント一覧。
export default exporter('endpoints', storage.get('endpoints', {}));
