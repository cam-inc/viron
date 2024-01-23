import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Props as BaseProps } from '~/components';
import Skelton from '~/components/Skelton';
import Button, { Props as ButtonProps } from '~/components/button';
import IconButton from '~/components/button/icon';
import Error from '~/components/error/';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import MoreIcon from '~/components/icon/more/outline';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import TerminalIcon from '~/components/icon/terminal/outline';
import TrashIcon from '~/components/icon/trash/outline';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Modal, { useModal } from '~/portals/modal';
import Popover, { usePopover } from '~/portals/popover';
import { Authentication, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document } from '~/types/oas';
import Info from './info';
import Qrcode from './qrcode';
import Signin from './signin/';
import Signout, { Props as SignoutProps } from './signout/';
import Thumbnail from './thumbnail/';
import PencilIcon from '~/components/icon/pencil/outline';
import EditEndpoint from './edit';

export type Props = {
  endpoint: Endpoint;
};
const Item: React.FC<Props> = ({ endpoint }) => {
  const [error, setError] = useState<BaseError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [document, setDocument] = useState<Document | null>(null);
  const [authentication, setAuthentication] = useState<Authentication | null>(
    null
  );
  const { connect, fetchDocument } = useEndpoint();

  // Connect to the endpoint and fetch an OAS document.
  const refresh = useCallback(async () => {
    setError(null);
    setIsPending(true);
    setDocument(null);
    setAuthentication(null);
    const connection = await connect(endpoint.url);
    if (connection.error) {
      setError(connection.error);
      setIsPending(false);
      return;
    }
    const fetchDocumentResult = await fetchDocument(endpoint);
    if (fetchDocumentResult.error) {
      setError(fetchDocumentResult.error);
      setIsPending(false);
      return;
    }
    const { document, authentication } = fetchDocumentResult;
    setDocument(document);
    setAuthentication(authentication);
    setIsPending(false);
  }, [endpoint, connect, fetchDocument]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRequestRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const content = useMemo<JSX.Element | null>(() => {
    if (isPending) {
      return <SkeltonItem on={COLOR_SYSTEM.BACKGROUND} />;
    }

    return (
      <_Item
        endpoint={endpoint}
        document={document}
        authentication={authentication}
        onRequestRefresh={handleRequestRefresh}
        error={error}
      />
    );
  }, [
    isPending,
    endpoint,
    document,
    authentication,
    handleRequestRefresh,
    error,
  ]);

  return (
    <article
      className={classNames('p-5 border rounded-2xl h-full', {
        'bg-thm-background border-thm-on-background-low': !error,
        'bg-thm-surface border-transparent': !!error,
      })}
    >
      {content}
    </article>
  );
};
export default Item;

const _Item: React.FC<{
  endpoint: Endpoint;
  document: Document | null;
  authentication: Authentication | null;
  onRequestRefresh: () => void;
  error: BaseError | null;
}> = ({ endpoint, document, authentication, onRequestRefresh, error }) => {
  const { t } = useTranslation();
  const { navigate, removeEndpoint } = useEndpoint();

  const menuPopover = usePopover<HTMLDivElement>();

  const editModal = useModal();
  const infoModal = useModal();
  const qrcodeModal = useModal();

  const handleMenuClick = useCallback(() => {
    menuPopover.open();
  }, [menuPopover]);

  const handleEditClick = useCallback<ButtonProps['onClick']>(() => {
    menuPopover.close();
    editModal.open();
  }, [menuPopover, editModal]);

  const handleInfoClick = useCallback<ButtonProps['onClick']>(() => {
    menuPopover.close();
    infoModal.open();
  }, [menuPopover, infoModal]);

  const handleQrcodeClick = useCallback<ButtonProps['onClick']>(() => {
    menuPopover.close();
    qrcodeModal.open();
  }, [menuPopover, qrcodeModal]);

  const handleRemoveClick = useCallback<ButtonProps['onClick']>(() => {
    menuPopover.close();
    removeEndpoint(endpoint.id);
  }, [endpoint, removeEndpoint, menuPopover]);

  const handleEnterClick = useCallback<ButtonProps['onClick']>(() => {
    navigate(endpoint);
  }, [endpoint, navigate]);

  const handleSignout = useCallback<SignoutProps['onSignout']>(() => {
    onRequestRefresh();
  }, [onRequestRefresh]);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center gap-2.5">
          {/* thumbnail */}
          <Thumbnail
            className="flex-none w-10 h-10"
            endpoint={endpoint}
            document={document || undefined}
          />
          <div className="text-thm-on-background text-base font-bold break-all grow">
            {endpoint.id}
          </div>
          {/* Popover icon */}
          <div className="flex-none">
            <div ref={menuPopover.targetRef}>
              <IconButton
                on={COLOR_SYSTEM.BACKGROUND}
                onClick={handleMenuClick}
              >
                <MoreIcon />
              </IconButton>
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="flex flex-col mt-4">
          <div className="text-thm-on-background-low text-xxs break-all font-bold">
            {document?.info.title || authentication?.oas.info.title || '---'}
          </div>
          <div className="text-thm-on-background-low text-xxs break-all">
            {endpoint.url}
          </div>
        </div>
        <div className="mt-4 grow flex items-end">
          {!!authentication && (
            <>
              {document ? (
                <div className="grow gap-2 flex items-center justify-end">
                  <Button
                    className="grow max-w-50%"
                    cs={COLOR_SYSTEM.PRIMARY}
                    IconRight={TerminalIcon}
                    label={t('enterEndpoint')}
                    onClick={handleEnterClick}
                  />
                  {authentication.list.find(
                    (item) => item.type === 'signout'
                  ) && (
                    <Signout
                      endpoint={endpoint}
                      authentication={authentication}
                      onSignout={handleSignout}
                    />
                  )}
                </div>
              ) : (
                <div className="flex-1">
                  <Signin endpoint={endpoint} authentication={authentication} />
                </div>
              )}
            </>
          )}
          {!!error && (
            <Error.renewal
              className="grow"
              on={COLOR_SYSTEM.SURFACE}
              error={error}
            />
          )}
        </div>
      </div>
      {/* Menu */}
      <Popover {...menuPopover.bind}>
        <div>
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            Icon={PencilIcon}
            label={t('endpointEditButtonLabel')}
            onClick={handleEditClick}
          />
        </div>
        <div>
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            Icon={InformationCircleIcon}
            label={t('endpointInformationButtonLabel')}
            onClick={handleInfoClick}
          />
        </div>
        <div>
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            Icon={QrcodeIcon}
            label={t('endpointQRCodeShareButtonLabel')}
            onClick={handleQrcodeClick}
          />
        </div>
        <div>
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            Icon={TrashIcon}
            label={t('removeEndpointButtonLabel')}
            onClick={handleRemoveClick}
          />
        </div>
      </Popover>
      {/* Edit */}
      <Modal {...editModal.bind}>
        <EditEndpoint
          onAdd={editModal.close}
          onCancel={editModal.close}
          endpoint={endpoint}
        />
      </Modal>
      {/* Info */}
      <Modal {...infoModal.bind}>
        <Info endpoint={endpoint} document={document || undefined} />
      </Modal>
      {/* QRCode */}
      <Modal {...qrcodeModal.bind}>
        <Qrcode endpoint={endpoint} />
      </Modal>
    </>
  );
};

const SkeltonItem: React.FC<BaseProps> = ({ on }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center gap-2.5">
        <Skelton className="w-10 h-10" on={on} variant="rounded" />
        <Skelton className="text-base w-full flex-1" on={on} variant="text" />
      </div>
      <div className="flex flex-col mt-4 space-y-1">
        <Skelton className="text-xxs" on={on} variant="text" />
        <Skelton className="text-xxs" on={on} variant="text" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skelton className="w-full h-8" on={on} variant="circular" />
        <Skelton className="w-full h-8" on={on} variant="circular" />
      </div>
    </div>
  );
};
