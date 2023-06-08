import qrcode from 'qrcode';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error';
import Head from '~/components/head';
import ClipboardCopyIcon from '~/components/icon/clipboardCopy/outline';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import { BaseError } from '~/errors';
import { useTranslation } from '~/hooks/i18n';
import { COLOR_SYSTEM, Endpoint } from '~/types';

type Props = {
  endpoint: Endpoint;
};

const QRCode: React.FC<Props> = ({ endpoint }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<BaseError | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<string>('');

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }
    const data = `${
      new URL(location.href).origin
    }/endpointimport?endpoint=${encodeURIComponent(JSON.stringify(endpoint))}`;
    qrcode.toCanvas(canvasElement, data, function (error) {
      if (error) {
        setError(new BaseError(error.message));
      }
    });
    setData(data);
  }, [endpoint]);

  const handleCopyClick = useCallback<FilledButtonProps['onClick']>(() => {
    globalThis.navigator.clipboard.writeText(data);
  }, [data]);

  if (error) {
    return <Error on={COLOR_SYSTEM.SURFACE} error={error} />;
  }

  return (
    <div className="text-thm-on-surface">
      <div className="pb-4 mb-4 border-b border-thm-on-surface-slight">
        <Head
          on={COLOR_SYSTEM.SURFACE}
          title={
            <div className="flex items-center gap-2">
              <QrcodeIcon className="w-em" />
              <div>{t('endpointQRCodeShare.title')}</div>
            </div>
          }
        />
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 pt-4 flex flex-col items-end gap-2 border-t border-dotted border-thm-on-surface-slight">
        <FilledButton
          cs={COLOR_SYSTEM.PRIMARY}
          Icon={ClipboardCopyIcon}
          label={t('endpointQRCodeShare.copyUrlButtonLabel')}
          onClick={handleCopyClick}
        />
        <div className="text-thm-on-surface-low text-xxs text-right max-w-[380px] break-all">
          {data}
        </div>
      </div>
    </div>
  );
};

export default QRCode;
