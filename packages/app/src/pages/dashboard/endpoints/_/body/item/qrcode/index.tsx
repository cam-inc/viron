import qrcode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import Error from '~/components/error';
import Head from '~/components/head';
import { BaseError } from '~/errors';
import { COLOR_SYSTEM, Endpoint, EndpointForDistribution } from '~/types';

type Props = {
  endpoint: Endpoint;
};

const QRCode: React.FC<Props> = ({ endpoint }) => {
  const [error, setError] = useState<BaseError | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }
    const _endpoint: EndpointForDistribution = {
      id: endpoint.id,
      url: endpoint.url,
    };
    const data = `${
      new URL(location.href).origin
    }/endpointimport?endpoint=${encodeURIComponent(JSON.stringify(_endpoint))}`;
    qrcode.toCanvas(canvasElement, data, function (error: Error) {
      if (error) {
        setError(new BaseError(error.message));
      }
    });
  }, [endpoint]);

  if (error) {
    return <Error on={COLOR_SYSTEM.SURFACE} error={error} />;
  }
  return (
    <div>
      <div>
        <Head on={COLOR_SYSTEM.SURFACE} title="QR Code" />
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default QRCode;
