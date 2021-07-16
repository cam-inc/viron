import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import CommonMark from '$components/commonMark';
import ExternalDocs from '$components/externalDocs';
import Modal, { useModal } from '$components/modal';
import { On, ON } from '$constants/index';
import { ClassName } from '$types/index';
import { Document, Operation } from '$types/oas';

type Props = {
  on: On;
  operationTag: NonNullable<Operation['tags']>[number];
  documentTags: Document['tags'];
  className?: ClassName;
};
const OperationTag: React.FC<Props> = ({
  on,
  operationTag,
  documentTags,
  className = '',
}) => {
  const meta = useMemo<NonNullable<Document['tags']>[number] | null>(
    function () {
      if (!documentTags) {
        return null;
      }
      const meta = documentTags.find(function (documentTag) {
        return documentTag.name === operationTag;
      });
      return meta || null;
    },
    [documentTags, operationTag]
  );

  const modal = useModal();
  const handleClick = useCallback(
    function () {
      modal.open();
    },
    [modal]
  );

  return (
    <>
      <div
        className={classnames('py-1 p-2 text-xxs rounded', className, {
          'bg-on-background-faint text-on-background': on === ON.BACKGROUND,
          'bg-on-surface-faint text-on-surface': on === ON.SURFACE,
          'bg-on-primary-faint text-on-primary': on === ON.PRIMARY,
          'bg-on-complementary-faint text-on-complementary':
            on === ON.COMPLEMENTARY,
        })}
        onClick={handleClick}
      >
        {operationTag}
      </div>
      {meta && (
        <Modal {...modal.bind}>
          <div>{meta.name}</div>
          {meta.description && <CommonMark on={on} data={meta.description} />}
          {meta.externalDocs && (
            <ExternalDocs on={on} data={meta.externalDocs} />
          )}
        </Modal>
      )}
    </>
  );
};
export default OperationTag;
