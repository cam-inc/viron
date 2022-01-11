import React, { useCallback } from 'react';
import OutlineButton, {
  Props as OutlineButtonProps,
} from '~/components/button/outline';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Head from '~/components/head';
import ArrowDownIcon from '~/components/icon/arrowCircleDown/outline';
import ArrowUpIcon from '~/components/icon/arrowCircleUp/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import PencilIcon from '~/components/icon/pencil/outline';
import TrashIcon from '~/components/icon/trash/outline';
import { useEndpoint } from '~/hooks/endpoint';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM, EndpointGroup } from '~/types';

export type Props = {
  group: EndpointGroup;
};
const Item: React.FC<Props> = ({ group }) => {
  const { removeGroup, ascendGroup, descendGroup } = useEndpoint();
  const removeConfirmationModal = useModal();

  const handleUpClick = useCallback<TextButtonProps['onClick']>(() => {
    ascendGroup(group.id);
  }, [group, ascendGroup]);

  const handleDownClick = useCallback<TextButtonProps['onClick']>(() => {
    descendGroup(group.id);
  }, [group, descendGroup]);

  const handleEditClick = useCallback<OutlineButtonProps['onClick']>(() => {
    // TODO
  }, []);

  const handleRemoveClick = useCallback<OutlineButtonProps['onClick']>(() => {
    removeConfirmationModal.open();
  }, [removeConfirmationModal]);

  const handleRemoveConfirmationRequestCancel = useCallback<
    RemoveConfirmationProps['onRequestCancel']
  >(() => {
    removeConfirmationModal.close();
  }, [removeConfirmationModal]);

  const handleRemoveConfirmationRequestRemove = useCallback<
    RemoveConfirmationProps['onRequestRemove']
  >(() => {
    removeConfirmationModal.close();
    removeGroup(group.id);
  }, [group, removeGroup, removeConfirmationModal]);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <ChevronRightIcon className="w-em" />
        </div>
        <div className="flex-1">
          <div className="text-base font-bold">{group.name}</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-thm-on-background-low">{group.id}</div>
            {group.description && (
              <div className="text-sm text-thm-on-background-low">
                {group.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex items-center gap-2">
          <TextButton
            cs={COLOR_SYSTEM.PRIMARY}
            label="Move Up"
            Icon={ArrowUpIcon}
            onClick={handleUpClick}
          />
          <TextButton
            cs={COLOR_SYSTEM.PRIMARY}
            label="Move Down"
            Icon={ArrowDownIcon}
            onClick={handleDownClick}
          />
          <OutlineButton
            cs={COLOR_SYSTEM.PRIMARY}
            label="Edit"
            Icon={PencilIcon}
            onClick={handleEditClick}
          />
          <OutlineButton
            cs={COLOR_SYSTEM.PRIMARY}
            label="Remove"
            Icon={TrashIcon}
            onClick={handleRemoveClick}
          />
        </div>
      </div>
      <Modal {...removeConfirmationModal.bind}>
        <RemoveConfirmation
          onRequestCancel={handleRemoveConfirmationRequestCancel}
          onRequestRemove={handleRemoveConfirmationRequestRemove}
        />
      </Modal>
    </>
  );
};
export default Item;

type RemoveConfirmationProps = {
  onRequestCancel: () => void;
  onRequestRemove: () => void;
};
const RemoveConfirmation: React.FC<RemoveConfirmationProps> = ({
  onRequestCancel,
  onRequestRemove,
}) => {
  const handleCancelClick = useCallback<TextButtonProps['onClick']>(() => {
    onRequestCancel();
  }, [onRequestCancel]);

  const handleRemoveClick = useCallback<FilledButtonProps['onClick']>(() => {
    onRequestRemove();
  }, [onRequestRemove]);

  return (
    <div className="space-y-8">
      <Head on={COLOR_SYSTEM.SURFACE} title="Remove a Group" />
      <div className="flex justify-end gap-2">
        <TextButton
          cs={COLOR_SYSTEM.PRIMARY}
          label="Cancel"
          onClick={handleCancelClick}
        />
        <FilledButton
          cs={COLOR_SYSTEM.PRIMARY}
          label="Remove"
          onClick={handleRemoveClick}
        />
      </div>
    </div>
  );
};
