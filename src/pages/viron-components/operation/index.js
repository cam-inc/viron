import '../../../components/viron-dialog/index.tag';
import '../../../components/viron-error/index.tag';
import util from '../../../components/viron-parameters/util';
import i18n from '../../../core/i18n';

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
  // x-anyof変更可能か否か。
  this.isSwitchable = true;
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
    this.submitLabel = customSubmitLabel || i18n.get('pg.components.operation.label_get');
    this.successMessage = i18n.get('pg.components.operation.label_get_info');
    break;
  case 'post':
    this.submitLabel = customSubmitLabel || i18n.get('pg.components.operation.label_post');
    successMessage = i18n.get('pg.components.operation.label_post_info');
    break;
  case 'put':
    this.submitLabel = customSubmitLabel || i18n.get('pg.components.operation.label_put');
    successMessage = i18n.get('pg.components.operation.label_put_info');
    break;
  case 'delete':
    this.submitLabel = customSubmitLabel || i18n.get('pg.components.operation.label_delete');
    this.submitModifier = 'emphasised';
    successMessage = i18n.get('pg.components.operation.label_delete_info');
    break;
  default:
    this.submitLabel = i18n.get('pg.components.operation.label_default');
    successMessage = i18n.get('pg.components.operation.label_default_info');
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
            title: i18n.get('pg.components.operation.error_auth')
          }).then(() => {
            this.getRouter().navigateTo('/');
          });
        }
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };

  const confirmSubmit = () => {
    let isOperating = false;
    if (!this.isValid) {
      return;
    }
    Promise.resolve().then(() => store.action('modals.add', 'viron-dialog', {
      title: this.title,
      message: i18n.get('pg.components.operation.comfirm'),
      labelPositive: this.submitLabel,
      onPositiveSelect: () => {
        if (isOperating) return;
        isOperating = true;
        operate();
      }
    }));
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

  this.handleFormSubmit = () => {
    confirmSubmit();
  };

  this.handleSubmitTap = () => {
    confirmSubmit();
  };
}
