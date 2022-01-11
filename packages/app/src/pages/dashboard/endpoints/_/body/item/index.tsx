import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Error from '~/components/error/';
import DotsCircleHorizontalIcon from '~/components/icon/dotsCircleHorizontal/outline';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import TrashIcon from '~/components/icon/trash/outline';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
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
      return <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />;
    }
    if (isPending) {
      return <div>pending...</div>;
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
    <div className="p-2 border border-thm-on-background-faint rounded">
      {content}
    </div>
  );
};
export default Item;

const _Item: React.FC<{
  endpoint: Endpoint;
  document: Document | null;
  authentication: Authentication;
  onRequestRefresh: () => void;
}> = ({ endpoint, document, authentication, onRequestRefresh }) => {
  const { navigate, removeEndpoint } = useEndpoint();

  const menuPopover = usePopover<HTMLDivElement>();
  const infoModal = useModal();
  const qrcodeModal = useModal();

  const handleMenuClick = useCallback<TextButtonProps['onClick']>(() => {
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

  const handleEnterClick = useCallback<FilledButtonProps['onClick']>(() => {
    navigate(endpoint);
  }, [endpoint, navigate]);

  const handleSignout = useCallback<SignoutProps['onSignout']>(() => {
    onRequestRefresh();
  }, [onRequestRefresh]);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <Thumbnail endpoint={endpoint} />
        </div>
        <div className="flex-1">
          <div className="text-thm-on-background-low text-xs">
            {endpoint.id}
          </div>
          <div className="text-thm-on-background text-sm font-bold">
            {document?.info.title || '---'}
          </div>
          <div className="text-thm-on-background-low text-xxs">
            {endpoint.url}
          </div>
        </div>
        <div className="flex-none flex items-center gap-2">
          <div ref={menuPopover.targetRef}>
            <TextButton
              cs={COLOR_SYSTEM.PRIMARY}
              Icon={DotsCircleHorizontalIcon}
              label="Menu"
              onClick={handleMenuClick}
            />
          </div>
          {document ? (
            <>
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                Icon={DotsCircleHorizontalIcon}
                label="Enter"
                onClick={handleEnterClick}
              />
              <Signout
                endpoint={endpoint}
                authentication={authentication}
                onSignout={handleSignout}
              />
            </>
          ) : (
            <Signin endpoint={endpoint} authentication={authentication} />
          )}
        </div>
      </div>
      {/* Menu */}
      <Popover {...menuPopover.bind}>
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={InformationCircleIcon}
          label="Information"
          onClick={handleInfoClick}
        />
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={QrcodeIcon}
          label="QR Code"
          onClick={handleQrcodeClick}
        />
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={TrashIcon}
          label="Remove"
          onClick={handleRemoveClick}
        />
      </Popover>
      {/* Info */}
      <Modal {...infoModal.bind}>
        <Info endpoint={endpoint} />
      </Modal>
      {/* QRCode */}
      <Modal {...qrcodeModal.bind}>
        <Qrcode endpoint={endpoint} />
      </Modal>
    </>
  );
};
