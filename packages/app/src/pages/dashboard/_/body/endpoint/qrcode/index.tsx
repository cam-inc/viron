import qrcode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import Error from '~/components/error';
import { BaseError } from '~/errors';
import { COLOR_SYSTEM, Endpoint, EndpointForDistribution } from '~/types';

type Props = {
  endpoint: Endpoint;
};

const QRCode: React.FC<Props> = ({ endpoint }) => {
  const [error, setError] = useState<BaseError | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(
    function () {
      const canvasElement = canvasRef.current;
      if (!canvasElement) {
        return;
      }
      const _endpoint: EndpointForDistribution = {
        ...endpoint,
      };
      const data = `${
        new URL(location.href).origin
      }/endpointimport?endpoint=${encodeURIComponent(
        JSON.stringify(_endpoint)
      )}`;
      qrcode.toCanvas(canvasElement, data, function (error: Error) {
        if (error) {
          setError(new BaseError(error.message));
        }
      });
    },
    [endpoint, canvasRef]
  );

  if (error) {
    return <Error on={COLOR_SYSTEM.SURFACE} error={error} />;
  }
  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCode;
