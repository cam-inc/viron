import _QRCode from 'qrcode';
import React, { useEffect, useRef } from 'react';
import { Endpoint, EndpointForDistribution } from '$types/index';

type Props = {
  endpoint: Endpoint;
};
const QRCode: React.FC<Props> = ({ endpoint }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(
    function () {
      const canvasElement = canvasRef.current;
      if (!canvasElement) {
        return;
      }
      const _endpoint: EndpointForDistribution = {
        ...endpoint,
        authConfigs: null,
        document: null,
      };
      const data = `${
        new URL(location.href).origin
      }/endpointimport?endpoint=${encodeURIComponent(
        JSON.stringify(_endpoint)
      )}`;
      _QRCode.toCanvas(canvasElement, data, function (error: Error) {
        if (!!error) {
          // TODO
          console.error(error);
        }
      });
    },
    [canvasRef.current]
  );

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
export default QRCode;
