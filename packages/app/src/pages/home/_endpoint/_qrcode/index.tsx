import { ImQrcode } from '@react-icons/all-files/im/ImQrcode';
import qrcode from 'qrcode';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ON } from '$constants/index';
import Button from '$components/button';
import Error from '$components/error';
import Modal, { useModal } from '$components/modal';
import { BaseError } from '$errors/index';
import { Endpoint, EndpointForDistribution } from '$types/index';

type Props = {
  endpoint: Endpoint;
};
const QRCode: React.FC<Props> = ({ endpoint }) => {
  const modal = useModal();
  const handleClick = useCallback(
    function () {
      modal.open();
    },
    [modal]
  );

  return (
    <>
      <Button
        on="surface"
        variant="text"
        Icon={ImQrcode}
        onClick={handleClick}
      />
      <Modal {...modal.bind}>
        <_QRCode endpoint={endpoint} />
      </Modal>
    </>
  );
};
export default QRCode;

const _QRCode: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => {
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
        authConfigs: null,
        document: null,
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
    return <Error on={ON.SURFACE} error={error} />;
  }
  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};
