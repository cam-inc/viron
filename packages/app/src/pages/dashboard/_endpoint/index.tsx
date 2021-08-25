import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import { BiDotsVerticalRounded } from '@react-icons/all-files/bi/BiDotsVerticalRounded';
import { BiInfoCircle } from '@react-icons/all-files/bi/BiInfoCircle';
import { ImQrcode } from '@react-icons/all-files/im/ImQrcode';
import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Button from '$components/button';
import Error from '$components/error';
import Modal, { useModal } from '$components/modal';
import Popover, { usePopover } from '$components/popover';
import Spinner from '$components/spinner';
import { ON, STATUS_CODE } from '$constants/index';
import { BaseError, HTTPUnexpectedError, NetworkError } from '$errors/index';
import { listState } from '$store/atoms/endpoint';
import { ClassName, Endpoint } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import Enter from './_enter';
import Info from './_info';
import QRCode from './_qrcode/index';
import Signin from './_signin';
import Signout from './_signout';
import Thumbnail from './_thumbnail';

export type Props = {
  endpoint: Endpoint;
  onRemove: (endpoint: Endpoint) => void;
  className?: ClassName;
};
const _Endpoint: React.FC<Props> = ({ endpoint, onRemove, className = '' }) => {
  // Menu
  const menuPopover = usePopover<HTMLDivElement>();
  const handleMenuClick = useCallback(
    function () {
      menuPopover.open();
    },
    [menuPopover]
  );

  // Info
  const infoModal = useModal();
  const handleInfoClick = useCallback(
    function () {
      menuPopover.close();
      infoModal.open();
    },
    [infoModal, menuPopover]
  );

  // QRCode
  const qrcodeModal = useModal();
  const handleQRCodeClick = useCallback(
    function () {
      qrcodeModal.open();
      menuPopover.close();
    },
    [qrcodeModal, menuPopover]
  );

  // Remove
  const setEndpoints = useSetRecoilState(listState);
  const handleRemoveClick = useCallback(
    function () {
      menuPopover.close();
      setEndpoints(function (currVal) {
        return currVal.filter(function (_endpoint) {
          return _endpoint.id !== endpoint.id;
        });
      });
      onRemove(endpoint);
    },
    [endpoint, setEndpoints, menuPopover]
  );

  // Data fetching.
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isSigninRequired, setIsSigninRequired] = useState<boolean>(false);
  const [error, setError] = useState<BaseError | null>(null);
  useEffect(
    function () {
      if (!endpoint.isPrivate) {
        setIsSigninRequired(false);
        setIsPending(false);
        return;
      }
      // Ping to see whether the authorization cookie is valid.
      const f = async function () {
        const [response, responseError] = await promiseErrorHandler(
          fetch(endpoint.url, {
            mode: 'cors',
            credentials: 'include',
          })
        );
        if (!!responseError) {
          const error = new NetworkError(responseError.message);
          setError(error);
          return;
        }
        if (response.ok) {
          setIsSigninRequired(false);
          setIsPending(false);
          return;
        }
        if (
          response.status === STATUS_CODE.UNAUTHORIZED ||
          response.status === STATUS_CODE.FORBIDDEN
        ) {
          setIsSigninRequired(true);
          setIsPending(false);
          return;
        }
        const error = new HTTPUnexpectedError();
        setError(error);
        return;
      };
      f();
    },
    [endpoint]
  );

  const handleSignout = useCallback(
    function () {
      setIsSigninRequired(true);
    },
    [setIsSigninRequired]
  );

  if (error) {
    return (
      <div className={classnames('p-2', className)}>
        <Error on={ON.SURFACE} error={error} />
      </div>
    );
  }

  if (isPending) {
    return (
      <div
        className={classnames(
          'min-h-[72px] p-2 flex items-center justify-center',
          className
        )}
      >
        <Spinner on={ON.SURFACE} className="w-4" />
      </div>
    );
  }

  return (
    <>
      <div className={classnames('p-2 flex flex-col gap-2', className)}>
        {/* Headd */}
        <div className="flex-none flex items-center gap-2">
          <div className="flex-none">
            <Thumbnail className="" endpoint={endpoint} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-on-surface-low text-xxs">{endpoint.id}</div>
            <div className="text-on-surface-high text-xs">
              {endpoint.document?.info.title || '---'}
            </div>
          </div>
          <div className="flex-none">
            <div ref={menuPopover.targetRef}>
              <Button
                on={ON.SURFACE}
                variant="text"
                Icon={BiDotsVerticalRounded}
                onClick={handleMenuClick}
              />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 py-2 border-t border-b border-dotted border-on-surface-faint">
          <div className="text-on-surface-low text-xxs">{endpoint.url}</div>
          <div className="text-xxs">
            {endpoint.isPrivate ? 'private' : 'public'}
          </div>
        </div>
        {/* Tail */}
        <div className="flex-none flex items-center justify-end gap-2">
          <Enter endpoint={endpoint} isSigninRequired={isSigninRequired} />
          <Signin endpoint={endpoint} isSigninRequired={isSigninRequired} />
          <Signout
            endpoint={endpoint}
            isSigninRequired={isSigninRequired}
            onSignout={handleSignout}
          />
        </div>
      </div>
      {/* Menu */}
      <Popover {...menuPopover.bind}>
        <Button
          on={ON.SURFACE}
          variant="text"
          Icon={BiInfoCircle}
          label="Info"
          onClick={handleInfoClick}
        />
        <Button
          on="surface"
          variant="text"
          Icon={ImQrcode}
          label="QR Code"
          onClick={handleQRCodeClick}
        />
        <Button
          on="surface"
          variant="text"
          Icon={AiFillDelete}
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
        <QRCode endpoint={endpoint} />
      </Modal>
    </>
  );
};

export default _Endpoint;
