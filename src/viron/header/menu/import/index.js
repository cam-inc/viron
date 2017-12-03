import '../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.errorMessage = null;
  this.endpoints = null;

  this.handleFileChange = jsonFile => {
    if (!jsonFile) {
      this.errorMessage = null;
      this.endpoints = null;
      this.update();
      return;
    }

    // ファイルがjsonであるか
    // Edge v.15環境で`file/type`値が空文字になるため、Edge以外の環境のみtypeチェックを行う。
    if (!store.getter('ua.isEdge') && jsonFile.type !== 'application/json') {
      this.errorMessage = 'JSON形式のファイルを選択して下さい。';
      this.endpoints = null;
      this.update();
      return;
    }

    // ファイルをテキストとして読み込む。
    const reader = new FileReader();
    reader.readAsText(jsonFile);
    // 読み込みが失敗した。
    reader.onerror = err => {
      this.endpoints = null;
      this.errorMessage = err.message || 'ファイルの読み込みに失敗しました。';
      this.update();
    };
    // 読み込みが成功し、完了した。
    reader.onload = event => {
      const text = event.target.result;
      try {
        this.endpoints = JSON.parse(text);
        this.errorMessage = '';
      } catch (e) {
        this.endpoints = null;
        this.errorMessage = e.message || 'JSON形式のファイルを選択して下さい。';
      } finally {
        this.update();
      }
    };
  };

  this.handleImportButtonTap = () => {
    if (!this.endpoints) {
      return;
    }
    Promise
      .resolve()
      .then(() => store.action('endpoints.mergeAll', this.endpoints))
      .then(() => {
        this.close();
        return store.action('toasts.add', {
          message: 'エンドポイント一覧を読み込みました。'
        });
      })
      .catch(err => {
        this.close();
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };
}
