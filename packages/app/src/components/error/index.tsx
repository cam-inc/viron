import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { Props as BaseProps } from '~/components';
import ExclamationIcon from '~/components/icon/exclamation/outline';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import { BaseError } from '~/errors';
import { Trans, useTranslation } from '~/hooks/i18n';
import Modal, { useModal } from '~/portals/modal/';
import { error as logError, NAMESPACE } from '~/utils/logger';

type Props = BaseProps & {
  error?: BaseError;
  withModal?: boolean;
  reset?: VoidFunction;
};
const Error: React.FC<Props> & {
  renewal: React.FC<Props>;
} = (props) => {
  const { error, withModal = false } = props;

  // log error.
  useEffect(() => {
    if (!error) {
      return;
    }
    logError({
      messages: [error],
      // TODO: namespaceを変えること。
      namespace: NAMESPACE.REACT_COMPONENT,
    });
  }, [error]);

  const modal = useModal();
  useEffect(() => {
    if (!error || !withModal) {
      return;
    }
    modal.open();
  }, [error, withModal, modal.open, modal]);

  return (
    <>
      {withModal ? (
        <Modal {...modal.bind}>
          <_Error {...props} />
        </Modal>
      ) : (
        <_Error {...props} />
      )}
    </>
  );
};

const Renewal: React.FC<Props> = (props) => {
  const { error, withModal = false, reset } = props;

  // log error.
  useEffect(() => {
    if (!error) {
      return;
    }
    logError({
      messages: [error],
      // TODO: namespaceを変えること。
      namespace: NAMESPACE.REACT_COMPONENT,
    });
  }, [error]);

  const modal = useModal(reset);
  useEffect(() => {
    if (!error || !withModal) {
      return;
    }
    modal.open();
  }, [error, modal, withModal]);

  return (
    <>
      {withModal ? (
        <Modal {...modal.bind}>
          <_Error.renewal {...props} />
        </Modal>
      ) : (
        <_Error.renewal {...props} />
      )}
    </>
  );
};

Error.renewal = Renewal;

export default Error;

export const useError = (
  props: Omit<Props, 'error'>
): {
  setError: (error: BaseError | null) => void;
  bind: Props;
} => {
  const [error, setError] = useState<BaseError | null>(null);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    setError,
    bind: {
      error: error as Props['error'],
      reset,
      ...props,
    },
  };
};

const _Error: React.FC<Props> & {
  renewal: React.FC<Props>;
} = ({ className = '', on, error }) => {
  if (!error) {
    return null;
  }
  return (
    <div className={classnames(`text-xs text-thm-on-${on}`, className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-none">
            <ExclamationIcon className="w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold">{error.name}</div>
            <div className={`text-xs text-thm-on-${on}-low`}>
              [{error.code}]
            </div>
          </div>
        </div>
        {error.message && <div className="text-xs">{error.message}</div>}
        {/*
        {error instanceof NetworkError && (
          <div>
            <div>TODO: NetworkError</div>
          </div>
        )}
        {error instanceof HTTP401Error && (
          <div>
            <div>TODO: 認証が必要よ。</div>
            <div>
              <Link on={on} to="/dashboard/endpoints">
                home
              </Link>
            </div>
          </div>
        )}
        {error instanceof HTTP403Error && (
          <div>
            <div>TODO: コンテンツへのアクセス権がないよ。</div>
          </div>
        )}
     */}
      </div>
    </div>
  );
};

const _ErrorRenewal: React.FC<Props> = ({ className = '', on, error }) => {
  const { t } = useTranslation();
  if (!error) {
    return null;
  }
  return (
    <div className={classnames(`text-xs text-thm-on-${on}`, className)}>
      <div className="flex flex-col">
        <div
          className={`flex items-center pb-3 gap-1 border-b border-thm-on-${on}-slight`}
        >
          <div className="flex-none">
            <InformationCircleIcon className="w-6 text-thm-error" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-thm-error">{error.name}</div>
          </div>
        </div>
        <p className="mt-6 text-base text-thm-error">
          <Trans
            t={t}
            i18nKey="fetchError"
            components={{
              br: <br />,
            }}
          />
        </p>
        {error.message && (
          <>
            <div className="mt-10 text-xs">{t('detail')}</div>
            <textarea
              className={`block w-full min-h-[160px] mt-2 p-3 border rounded resize-none border-thm-on-${on}-faint bg-thm-on-${on}-slight text-thm-on-${on} focus:outline-none`}
              value={error.message}
              readOnly
            />
          </>
        )}
      </div>
    </div>
  );
};

_Error.renewal = _ErrorRenewal;
