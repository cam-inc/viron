import {
  CircleArrowDownIcon,
  ArrowUpIcon,
  MenuIcon,
  TrashIcon,
} from 'lucide-react';
import React, { useCallback } from 'react';
import Head from '~/components/head';
import { Button } from '~/components/ui/button';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import Modal, { useModal } from '~/portals/modal';
import Popover, { usePopover } from '~/portals/popover';
import { COLOR_SYSTEM, EndpointGroup } from '~/types';

export type Props = {
  group: EndpointGroup;
};
const Item: React.FC<Props> = ({ group }) => {
  const { removeGroup, ascendGroup, descendGroup } = useEndpoint();
  const { t } = useTranslation();

  const menuPopover = usePopover<HTMLDivElement>();
  const handleMenuClick = useCallback(() => {
    menuPopover.open();
  }, [menuPopover]);

  const handleUpClick = useCallback(() => {
    ascendGroup(group.id);
    menuPopover.close();
  }, [group, ascendGroup, menuPopover]);

  const handleDownClick = useCallback(() => {
    descendGroup(group.id);
    menuPopover.close();
  }, [group, descendGroup, menuPopover]);

  const removeConfirmationModal = useModal({});

  const handleRemoveClick = useCallback(() => {
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
      <div className="flex items-center gap-2 p-2 hover:bg-thm-on-background-faint">
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
          <div ref={menuPopover.targetRef}>
            <Button variant="ghost" onClick={handleMenuClick}>
              <MenuIcon />
              {t('menuButtonLabel')}
            </Button>
          </div>
          {/*
             TODO: 編集機能。
          <OnButton
            on={COLOR_SYSTEM.BACKGROUND}
            label="Edit"
            Icon={PencilIcon}
            onClick={handleEditClick}
          />
       */}
          <Button onClick={handleRemoveClick}>
            <TrashIcon />
            {t('removeButtonLabel')}
          </Button>
        </div>
      </div>
      <Popover {...menuPopover.bind}>
        <Button variant="ghost" onClick={handleUpClick}>
          <ArrowUpIcon />
          {t('moveUpButtonLabel')}
        </Button>
        <Button variant="ghost" onClick={handleDownClick}>
          <CircleArrowDownIcon />
          {t('moveDownButtonLabel')}
        </Button>
      </Popover>
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
  const { t } = useTranslation();

  const handleCancelClick = useCallback(() => {
    onRequestCancel();
  }, [onRequestCancel]);

  const handleRemoveClick = useCallback(() => {
    onRequestRemove();
  }, [onRequestRemove]);

  return (
    <div className="space-y-8">
      <Head
        on={COLOR_SYSTEM.SURFACE}
        title={t('removeModal.title')}
        description={t('removeModal.description')}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancelClick}>
          {t('cancelButtonLabel')}
        </Button>
        <Button onClick={handleRemoveClick}>{t('removeButtonLabel')}</Button>
      </div>
    </div>
  );
};
