import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Error from '~/components/error';
import Paper from '~/components/paper';
import Spinner from '~/components/spinner';
import { HTTP_STATUS } from '~/constants';
import { BaseError, HTTPUnexpectedError, NetworkError } from '~/errors';
import {
  useAppScreenGlobalStateValue,
  useEndpointListGlobalState,
} from '~/store';
import Modal, { useModal } from '~/portals/modal';
import Popover, { usePopover } from '~/portals/popover';
import { ClassName, COLOR_SYSTEM, Endpoint } from '~/types';
import { promiseErrorHandler } from '~/utils';
import Enter from './enter';
import Info from './info';
import QRCode from './qrcode/index';
import Signin from './signin';
import Signout from './signout';
import Thumbnail from './thumbnail';

export type Props = {
  endpoint: Endpoint;
  onRemove: (endpoint: Endpoint) => void;
  className?: ClassName;
};
const _Endpoint: React.FC<Props> = ({ endpoint, onRemove, className = '' }) => {
  // Endpoints
  const [endpoints, setEndpoints] = useEndpointListGlobalState();

  // Menu
  const menuPopover = usePopover<HTMLDivElement>();
  const handleMenuClick = useCallback(
    function () {
      menuPopover.open();
    },
    [menuPopover]
  );

  // Sort by Drag and Drop.
  const screen = useAppScreenGlobalStateValue();
  const { lg } = screen;
  const DnDItemType = 'endpoint';
  type DnDItem = {
    endpoint: Endpoint;
  };
  const sort = useCallback(
    function (targetEndpoint: Endpoint, toIndex: number) {
      setEndpoints(function (currVal) {
        const newVal = [...currVal];
        const targetIndex = newVal.findIndex(function (_endpoint) {
          return _endpoint.id === targetEndpoint.id;
        });
        const clonedEndpoint = _.cloneDeep(newVal[targetIndex]);
        newVal.splice(toIndex, 0, clonedEndpoint);
        newVal.splice(targetIndex < toIndex ? targetIndex : targetIndex + 1, 1);
        return newVal;
      });
    },
    [setEndpoints]
  );
  const [draggable, draggableTargetRef, draggablePreviewRef] = useDrag(
    {
      type: DnDItemType,
      collect: function (monitor) {
        return {
          isDragging: monitor.isDragging(),
        };
      },
      item: {
        endpoint,
      },
    },
    [endpoints, endpoint]
  );
  type DrappableCollectedProps = {
    isOver: boolean;
    isDroppable: boolean;
  };
  const [droppablePrev, droppablePrevTargetRef] = useDrop<
    DnDItem,
    void,
    DrappableCollectedProps
  >(
    {
      accept: DnDItemType,
      drop: function (item) {
        const toIndex = endpoints.findIndex(function (_endpoint) {
          return _endpoint.id === endpoint.id;
        });
        sort(item.endpoint, toIndex);
      },
      canDrop: function (item) {
        const fromIndex = endpoints.findIndex(function (_endpoint) {
          return _endpoint.id === item.endpoint.id;
        });
        const toIndex = endpoints.findIndex(function (_endpoint) {
          return _endpoint.id === endpoint.id;
        });
        if (fromIndex === toIndex || fromIndex + 1 === toIndex) {
          return false;
        }
        return true;
      },
      collect: function (monitor) {
        return {
          isOver: monitor.isOver(),
          isDroppable: monitor.canDrop(),
        };
      },
    },
    [endpoints, endpoint, sort]
  );
  const [droppableNext, droppableNextTargetRef] = useDrop<
    DnDItem,
    void,
    DrappableCollectedProps
  >(
    {
      accept: DnDItemType,
      drop: function (item) {
        const toIndex =
          endpoints.findIndex(function (_endpoint) {
            return _endpoint.id === endpoint.id;
          }) + 1;
        sort(item.endpoint, toIndex);
      },
      canDrop: function (item) {
        const fromIndex = endpoints.findIndex(function (_endpoint) {
          return _endpoint.id === item.endpoint.id;
        });
        const toIndex =
          endpoints.findIndex(function (_endpoint) {
            return _endpoint.id === endpoint.id;
          }) + 1;
        if (endpoints.length !== toIndex) {
          return false;
        }
        if (fromIndex === toIndex || fromIndex + 1 === toIndex) {
          return false;
        }
        return true;
      },
      collect: function (monitor) {
        return {
          isOver: monitor.isOver(),
          isDroppable: monitor.canDrop(),
        };
      },
    },
    [endpoints, endpoint, sort]
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
    [endpoint, setEndpoints, menuPopover, onRemove]
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
          response.status === HTTP_STATUS.UNAUTHORIZED.code ||
          response.status === HTTP_STATUS.FORBIDDEN.code
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
      <Paper on={COLOR_SYSTEM.SURFACE} shadowElevation={0}>
        <div className={classnames('p-2', className)}>
          <Error on={COLOR_SYSTEM.SURFACE} error={error} />
        </div>
      </Paper>
    );
  }

  if (isPending) {
    return (
      <Paper on={COLOR_SYSTEM.SURFACE} shadowElevation={0}>
        <div
          className={classnames(
            'min-h-[72px] p-2 flex items-center justify-center',
            className
          )}
        >
          <Spinner on={COLOR_SYSTEM.SURFACE} className="w-4" />
        </div>
      </Paper>
    );
  }

  return (
    <>
      <div className={classnames('flex gap-2 items-stretch', className)}>
        {droppablePrev.isDroppable && (
          <div
            className={classnames('flex-none w-4 relative', {
              'text-thm-on-background-low': !droppablePrev.isOver,
              'text-thm-on-background-high': droppablePrev.isOver,
            })}
            ref={droppablePrevTargetRef}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-current" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-current" />
            <div className="absolute top-0 right-0 left-0 m-auto w-0 h-full border-l border-current border-dashed" />
          </div>
        )}
        <Paper
          className="flex-1 min-w-0"
          on={COLOR_SYSTEM.SURFACE}
          shadowElevation={0}
        >
          <div
            className={classnames('p-2 flex flex-col gap-2 h-full', {
              'opacity-50': draggable.isDragging,
            })}
          >
            {/* Head */}
            <div className="flex-none flex items-center gap-2">
              <div className="flex-none" ref={draggablePreviewRef}>
                <Thumbnail className="" endpoint={endpoint} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-thm-on-surface-low text-xxs truncate">
                  {endpoint.id}
                </div>
                <div className="text-thm-on-surface-high text-xs truncate">
                  {endpoint.document?.info.title || '---'}
                </div>
              </div>
              <div className="flex-none">
                <div ref={menuPopover.targetRef}>
                  <button onClick={handleMenuClick}>menu</button>
                </div>
              </div>
              {/* TODO: 画面サイズではなく入力タイプに応じて表示の出し分けを行うこと。*/}
              {lg && (
                <div className="flex-none">
                  <div ref={draggableTargetRef}>
                    <button>drag</button>
                  </div>
                </div>
              )}
            </div>
            {/* Body */}
            <div className="flex-1 py-2 border-t border-b border-dotted border-thm-on-surface-faint">
              <div className="text-thm-on-surface-low text-xxs">
                {endpoint.url}
              </div>
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
        </Paper>
        {droppableNext.isDroppable && (
          <div
            className={classnames('flex-none w-4 relative', {
              'text-thm-on-background-low': !droppableNext.isOver,
              'text-thm-on-background-high': droppableNext.isOver,
            })}
            ref={droppableNextTargetRef}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-current" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-current" />
            <div className="absolute top-0 right-0 left-0 m-auto w-0 h-full border-l border-current border-dashed" />
          </div>
        )}
      </div>
      {/* Menu */}
      <Popover {...menuPopover.bind}>
        <button onClick={handleInfoClick}>info</button>
        <button onClick={handleQRCodeClick}>qrcode</button>
        <button onClick={handleRemoveClick}>remove</button>
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
