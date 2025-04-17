import {
  EllipsisVertical,
  Pencil,
  Info as InfoIcon,
  QrCode,
  Trash,
  ChevronRight,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Props as BaseProps } from '~/components';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Modal, { useModal } from '~/portals/modal';
import { Authentication, COLOR_SYSTEM, Endpoint } from '~/types';
import { Document } from '~/types/oas';
import EditEndpoint from './edit';
import Info from './info';
import Qrcode from './qrcode';
import Signin from './signin/';
import Signout, { Props as SignoutProps } from './signout/';
import Thumbnail from './thumbnail/';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  return content;
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

  const editModal = useModal({});
  const infoModal = useModal({});
  const qrcodeModal = useModal({});

  const handleEditClick = useCallback(() => {
    editModal.open();
  }, [editModal]);

  const handleInfoClick = useCallback(() => {
    infoModal.open();
  }, [infoModal]);

  const handleQrcodeClick = useCallback(() => {
    qrcodeModal.open();
  }, [qrcodeModal]);

  const handleRemoveClick = useCallback(() => {
    removeEndpoint(endpoint.id);
  }, [endpoint, removeEndpoint]);

  const handleEnterClick = useCallback(() => {
    navigate(endpoint);
  }, [endpoint, navigate]);

  const handleSignout = useCallback<SignoutProps['onSignout']>(() => {
    onRequestRefresh();
  }, [onRequestRefresh]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Thumbnail
              className="flex-none w-10 h-10"
              endpoint={endpoint}
              document={document || undefined}
            />
            <div className="text-xl font-bold break-all grow">
              {endpoint.id}
            </div>
            {/* TODO: ステータス表示 */}
            <Badge variant="destructive">error</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Pencil />
                  {t('endpointEditButtonLabel')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInfoClick}>
                  <InfoIcon />
                  {t('endpointInformationButtonLabel')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQrcodeClick}>
                  <QrCode />
                  {t('endpointQRCodeShareButtonLabel')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemoveClick}>
                  <Trash />
                  {t('removeEndpointButtonLabel')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-xxs break-all font-bold">
            {document?.info.title || authentication?.oas.info.title || '---'}
          </div>
          <div className="text-muted-foreground text-xxs break-all">
            {endpoint.url}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-end gap-2">
            {!!authentication && (
              <>
                {document ? (
                  <>
                    <Button onClick={handleEnterClick}>
                      {t('enterEndpoint')}
                      <ChevronRight />
                    </Button>
                    {authentication.list.find(
                      (item) => item.type === 'signout'
                    ) && (
                      <Signout
                        endpoint={endpoint}
                        authentication={authentication}
                        onSignout={handleSignout}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex-1">
                    <Signin
                      endpoint={endpoint}
                      authentication={authentication}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>
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

const SkeltonItem: React.FC<BaseProps> = () => {
  return <Skeleton className="h-[206px] rounded-xl" />;
};
