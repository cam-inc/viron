import storage from 'store';
import exporter from './exporter';

// 選択されているエンドポイント。
export default exporter('current', storage.get('current', null));
