import '../../../components/viron-dialog/index.tag';
import '../../../components/viron-error/index.tag';
import util from '../../../components/viron-parameters/util';

export default function() {
  const store = this.riotx.get();
  const operationObject = this.opts.operationObject;

  this.isValid = true;
  this.layoutType = store.getter('layout.type');
  // 入力値。
  // viron-parameterは参照元を弄る。ので予めdeepCloneしておく。
  this.val = util.generateInitialVal(operationObject.parameters, this.opts.initialVal);
  // タイトル
  this.title = operationObject.summary || operationObject.operationId;
  // submitボタンのラベリング。
  this.submitLabel = null;
  // submitボタンのmodifier。
  this.submitModifier = null;
  // 完了時のメッセージ。
  let successMessage = null;
  // methodで振り分けます。
  const method = store.getter('oas.pathItemObjectMethodNameByOperationId', operationObject.operationId);
  const customSubmitLabel = operationObject['x-submit-label'];
  switch (method) {
  case 'get':
    this.submitLabel = customSubmitLabel || '取得する';
    this.successMessage = '取得しました。';
    break;
  case 'post':
    this.submitLabel = customSubmitLabel || '新規作成する';
    successMessage = '新規作成しました。';
    break;
  case 'put':
    this.submitLabel = customSubmitLabel || '保存する';
    successMessage = '保存しました。';
    break;
  case 'delete':
    this.submitLabel = customSubmitLabel || '削除する';
    this.submitModifier = 'emphasised';
    successMessage = '削除しました。';
    break;
  default:
    this.submitLabel = '実行する';
    successMessage = '完了しました。';
    break;
  }

  const operate = () => {
    Promise
      .resolve()
      .then(() => store.action('components.operate', operationObject, this.val))
      .then(() => {
        this.close();
        this.opts.onSuccess();
        return store.action('toasts.add', {
          message: successMessage
        });
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

  const updateSubmitButton = () => {
    // 諸々の都合でthis.update()を使えない & 使いたくない。
    // ので、DOMを直接操作する。
    const submitButton = this.refs.submit;
    if (!submitButton) {
      return;
    }
    const className = 'ComponentsPage_Operation__submit--disabled';
    if (this.isValid) {
      submitButton.classList.remove(className);
    } else {
      submitButton.classList.add(className);
    }
  };

  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.update();
  });

  this.on('mount', () => {
    updateSubmitButton();
  });

  this.handleCancelTap = () => {
    this.close();
  };

  this.handleParametersChange = newValue => {
    this.val = newValue;
    this.update();
  };

  this.handleParametersValidate = isValid => {
    this.isValid = isValid;
    updateSubmitButton();
  };

  this.handleSubmitTap = () => {
    if (!this.isValid) {
      return;
    }

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
