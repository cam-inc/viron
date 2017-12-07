import '../../../components/viron-dialog/index.tag';
import '../../../components/viron-error/index.tag';
import util from '../../../components/viron-parameters/util';

export default function() {
  const store = this.riotx.get();
  const operationObject = this.opts.operationObject;

  // 入力値。
  // viron-parameterは参照元を弄る。ので予めdeepCloneしておく。
  this.val = util.generateInitialVal(operationObject.parameters, this.opts.initialVal);
  // タイトル
  this.title = operationObject.summary || operationObject.operationId;
  // submitボタンのラベリング。
  this.submitLabel = null;
  // submitボタンのmodifier。
  this.submitModifier = null;
  // methodで振り分けます。
  switch (store.getter('oas.pathItemObjectMethodNameByOperationId', operationObject.operationId)) {
  case 'get':
    this.submitLabel = '取得する';
    break;
  case 'post':
    this.submitLabel = '新規作成する';
    break;
  case 'put':
    this.submitLabel = '保存する';
    break;
  case 'delete':
    this.submitLabel = '削除する';
    this.submitModifier = 'emphasised';
    break;
  default:
    this.submitLabel = '実行する';
  }

  const operate = () => {
    Promise
      .resolve()
      .then(() => store.action('components.operate', operationObject, this.val))
      .then(() => {
        this.close();
        this.opts.onSuccess();
      })
      .catch(err => {
        if (err.status === 401) {
          return store.action('modals.add', 'viron-error', {
            title: '認証切れ'
          }).then(() => {
            this.getRouter().navigateTo('/');
          });
        }
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };

  this.handleCancelTap = () => {
    this.close();
  };

  this.handleParametersChange = newValue => {
    this.val = newValue;
    this.update();
  };

  this.handleSubmitTap = () => {
    Promise.resolve().then(() => store.action('modals.add', 'viron-dialog', {
      title: this.title,
      message: '本当に実行しますか？',
      labelPositive: this.submitLabel,
      onPositiveSelect: () => {
        operate();
      }
    }));
  };
}
