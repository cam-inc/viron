import qrcode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import Error from '~/components/error';
import Head from '~/components/head';
import QrcodeIcon from '~/components/icon/qrcode/outline';
import { BaseError } from '~/errors';
import { COLOR_SYSTEM, Endpoint } from '~/types';

type Props = {
  endpoint: Endpoint;
};

const QRCode: React.FC<Props> = ({ endpoint }) => {
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
    qrcode.toCanvas(canvasElement, data, function (error: Error) {
      if (error) {
        setError(new BaseError(error.message));
      }
    });
    setData(data);
  }, [endpoint]);

  if (error) {
    return <Error on={COLOR_SYSTEM.SURFACE} error={error} />;
  }

  return (
    <div>
      <div>
        <Head
          on={COLOR_SYSTEM.SURFACE}
          title={
            <div className="flex items-center gap-2">
              <QrcodeIcon className="w-em" />
              <div>QR Code</div>
            </div>
          }
          description="TODO:"
        />
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default QRCode;
