import { AlertCircle, Copy } from 'lucide-react';
import qrcode from 'qrcode';
import React, { useCallback, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { BaseError } from '~/errors';
import { useTranslation } from '~/hooks/i18n';
import { Endpoint } from '~/types';

type Props = {
  endpoint: Endpoint;
};

const QRCode: React.FC<Props> = ({ endpoint }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<BaseError | null>(null);
  const [data, setData] = useState<string>('');

  const handleCopyClick = useCallback(() => {
    globalThis.navigator.clipboard.writeText(data);
  }, [data]);

  const canvasRefCallback = useCallback(
    (canvasElement: HTMLCanvasElement | null) => {
      if (canvasElement) {
        const data = `${
          new URL(location.href).origin
        }/endpointimport?endpoint=${encodeURIComponent(
          JSON.stringify(endpoint)
        )}`;
        qrcode.toCanvas(canvasElement, data, function (error) {
          if (error) {
            setError(new BaseError(error.message));
          }
        });
        setData(data);
      }
    },
    [endpoint]
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('endpointQRCodeShare.title')}</DialogTitle>
      </DialogHeader>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center justify-center gap-4">
        <canvas ref={canvasRefCallback} />
        <Button onClick={handleCopyClick}>
          <Copy />
          {t('endpointQRCodeShare.copyUrlButtonLabel')}
        </Button>
      </div>
    </DialogContent>
  );
};

export default QRCode;
