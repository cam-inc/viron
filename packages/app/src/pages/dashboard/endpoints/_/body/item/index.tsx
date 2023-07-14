import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OutlineOnButton, {
  Props as OutlineOnButtonProps,
} from '~/components/button/outline/on';
import TextButton, {
  Props as TextButtonProps,
} from '~/components/button/text/on';
import Error from '~/components/error/';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import MoreIcon from '~/components/icon/more/outline';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import TerminalIcon from '~/components/icon/terminal/outline';
import TrashIcon from '~/components/icon/trash/outline';
import Spinner from '~/components/spinner';
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
    if (error) {
      return (
        <div className="flex flex-col gap-4 h-full justify-between">
          <div className="flex items-start gap-6">
            <div className="flex-none">
              <Thumbnail endpoint={endpoint} document={document || undefined} />
            </div>
            <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />
          </div>
          <div className="flex flex-col">
            <div className="text-thm-on-background-low text-xxs break-all">
              {endpoint.id}
            </div>
            <div className="text-thm-on-background text-sm font-bold break-all">
              {document?.info.title || authentication?.oas.info.title || '---'}
            </div>
            <div className="text-thm-on-background-low text-xxs break-all">
              {endpoint.url}
            </div>
          </div>
        </div>
      );
    }
    if (isPending) {
      return <Spinner className="w-4" on={COLOR_SYSTEM.BACKGROUND} />;
    }
    if (!authentication) {
      return null;
    }
    return (
      <_Item
        endpoint={endpoint}
        document={document}
        authentication={authentication}
        onRequestRefresh={handleRequestRefresh}
      />
    );
  }, [endpoint, error, isPending, document, authentication]);

  return (
    <article className="py-6 px-5 rounded-2xl border border-thm-on-background hover:bg-thm-on-background-faint h-full">
      {content}
    </article>
  );
};
export default Item;

const _Item: React.FC<{
  endpoint: Endpoint;
  document: Document | null;
  authentication: Authentication;
  onRequestRefresh: () => void;
}> = ({ endpoint, document, authentication, onRequestRefresh }) => {
  const { t } = useTranslation();
  const { navigate, removeEndpoint } = useEndpoint();

  const menuPopover = usePopover<HTMLDivElement>();
  const infoModal = useModal();
  const qrcodeModal = useModal();

  const handleMenuClick = useCallback(() => {
    menuPopover.open();
  }, [menuPopover]);

  const handleInfoClick = useCallback<TextButtonProps['onClick']>(() => {
    menuPopover.close();
    infoModal.open();
  }, [menuPopover, infoModal]);

  const handleQrcodeClick = useCallback<TextButtonProps['onClick']>(() => {
    menuPopover.close();
    qrcodeModal.open();
  }, [menuPopover, qrcodeModal]);

  const handleRemoveClick = useCallback<TextButtonProps['onClick']>(() => {
    menuPopover.close();
    removeEndpoint(endpoint.id);
  }, [endpoint, removeEndpoint, menuPopover]);

  const handleEnterClick = useCallback<OutlineOnButtonProps['onClick']>(() => {
    navigate(endpoint);
  }, [endpoint, navigate]);

  const handleSignout = useCallback<SignoutProps['onSignout']>(() => {
    onRequestRefresh();
  }, [onRequestRefresh]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          {/* thumbnail */}
          <div className="flex-none">
            <Thumbnail endpoint={endpoint} document={document || undefined} />
          </div>
          {/* Popover icon */}
          <div className="flex-none">
            <div ref={menuPopover.targetRef}>
              {/* TODO: Add this as component*/}
              <button
                className="p-1 hover:bg-thm-on-background-slight text-2xl rounded text-bg-thm-on-background"
                onClick={handleMenuClick}
              >
                <MoreIcon />
              </button>
            </div>
          </div>
        </div>
        {/* Info */}
        <div className="flex flex-col">
          <div className="text-thm-on-background-low text-xxs break-all">
            {endpoint.id}
          </div>
          <div className="text-thm-on-background text-sm font-bold break-all">
            {document?.info.title || authentication.oas.info.title || '---'}
          </div>
          <div className="text-thm-on-background-low text-xxs break-all">
            {endpoint.url}
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          {document ? (
            <>
              <OutlineOnButton.renewal
                className="grow max-w-50%"
                cs={COLOR_SYSTEM.BACKGROUND}
                IconRight={TerminalIcon}
                label={t('enterEndpoint')}
                onClick={handleEnterClick}
              />
              {authentication.list.find((item) => item.type === 'signout') && (
                <Signout
                  endpoint={endpoint}
                  authentication={authentication}
                  onSignout={handleSignout}
                />
              )}
            </>
          ) : (
            <Signin endpoint={endpoint} authentication={authentication} />
          )}
        </div>
      </div>
      {/* Menu */}
      <Popover {...menuPopover.bind}>
        <div>
          <TextButton
            on={COLOR_SYSTEM.SURFACE}
            Icon={InformationCircleIcon}
            label={t('endpointInformationButtonLabel')}
            onClick={handleInfoClick}
          />
        </div>
        <div>
          <TextButton
            on={COLOR_SYSTEM.SURFACE}
            Icon={QrcodeIcon}
            label={t('endpointQRCodeShareButtonLabel')}
            onClick={handleQrcodeClick}
          />
        </div>
        <div>
          <TextButton
            on={COLOR_SYSTEM.SURFACE}
            Icon={TrashIcon}
            label={t('removeEndpointButtonLabel')}
            onClick={handleRemoveClick}
          />
        </div>
      </Popover>
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
