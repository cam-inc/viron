import isObject from 'mout/lang/isObject';
import storage from 'store';
import exporter from './exporter';

// v0との下位互換性。
if (!isObject(storage.get('current'))) {
  storage.set('current', {});
}

// 選択されているエンドポイント。
export default exporter('current', storage.get('current', {}));
