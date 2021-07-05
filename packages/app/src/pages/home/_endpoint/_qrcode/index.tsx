import { ImQrcode } from '@react-icons/all-files/im/ImQrcode';
import qrcode from 'qrcode';
import React, { useCallback, useEffect, useRef } from 'react';
import Button from '$components/button';
import Modal, { useModal } from '$components/modal';
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
        if (!!error) {
          // TODO
          console.error(error);
        }
      });
    },
    [endpoint, canvasRef]
  );

  return <canvas ref={canvasRef} />;
};
