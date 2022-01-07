import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Props as BaseProps } from '~/components';
import ExclamationIcon from '~/components/icon/exclamation/outline';
import Link from '~/components/link';
import { BaseError, HTTP401Error, HTTP403Error, NetworkError } from '~/errors';
import Modal, { useModal } from '~/portals/modal';
import { error as logError, NAMESPACE } from '~/utils/logger';

type Props = BaseProps & {
  error?: BaseError;
  withModal?: boolean;
};
const Error: React.FC<Props> = (props) => {
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
  }, [error, withModal, modal.open]);

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
export default Error;

export const useError = (
  props: Omit<Props, 'error'>
): {
  setError: (error: BaseError | null) => void;
  bind: Props;
} => {
  const [error, setError] = useState<BaseError | null>(null);

  return {
    setError,
    bind: {
      error: error as Props['error'],
      ...props,
    },
  };
};

const _Error: React.FC<Props> = ({ className = '', on, error }) => {
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
        {error instanceof NetworkError && (
          <div>
            <div>TODO: NetworkError</div>
          </div>
        )}
        {error instanceof HTTP401Error && (
          <div>
            <div>TODO: 認証が必要よ。</div>
            <div>
              <Link on={on} to="/dashboard">
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
      </div>
    </div>
  );
};
