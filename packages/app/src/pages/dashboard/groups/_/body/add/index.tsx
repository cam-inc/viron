import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import OutlineButton, {
  Props as OutlineButtonProps,
} from '~/components/button/outline/on';
import Head from '~/components/head';
import Textinput from '~/components/textinput';
import { useEndpoint } from '~/hooks/endpoint';
import { COLOR_SYSTEM, EndpointGroup } from '~/types';

export type Props = {
  onAdd: () => void;
  onCancel: () => void;
};
const Add: React.FC<Props> = ({ onAdd, onCancel }) => {
  const { t } = useTranslation();
  const { addGroup } = useEndpoint();

  const schema = useMemo(
    () =>
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        description: yup.string(),
      }),
    []
  );
  const {
    register,
    handleSubmit: _handleSubmit,
    formState,
    setError,
    clearErrors,
  } = useForm<EndpointGroup & { manual?: string }>({
    resolver: yupResolver(schema),
  });
  const handleSubmit = useMemo(
    () =>
      _handleSubmit((data) => {
        const { error } = addGroup(data);
        if (error) {
          setError('manual', {
            type: 'manual',
            message: error.message || error.name,
          });
          return;
        }
        clearErrors();
        onAdd();
      }),
    [_handleSubmit, addGroup, setError, clearErrors, onAdd]
  );

  const handleCancelClick = useCallback<OutlineButtonProps['onClick']>(() => {
    onCancel();
  }, [onCancel]);
  const handleAddClick = useCallback<FilledButtonProps['onClick']>(() => {
    // Do nothing.
  }, []);

  return (
    <div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <Head
            on={COLOR_SYSTEM.SURFACE}
            title={t('pages.dashboard.group.005')}
            description={t('pages.dashboard.group.006')}
          />
        </div>
        <div className="space-y-4">
          <Textinput
            type="text"
            label={t('common.id')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.id}
            render={(bind) => <input {...bind} {...register('id')} />}
          />
          <Textinput
            type="text"
            label={t('common.name')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.name}
            render={(bind) => <input {...bind} {...register('name')} />}
          />
          <Textinput
            type="text"
            label={t('common.description')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.description}
            render={(bind) => <input {...bind} {...register('description')} />}
          />
        </div>
        <div className="flex justify-end gap-2">
          <OutlineButton
            on={COLOR_SYSTEM.SURFACE}
            label={t('common.cancel')}
            onClick={handleCancelClick}
          />
          <FilledButton
            type="submit"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('common.add')}
            onClick={handleAddClick}
          />
        </div>
      </form>
    </div>
  );
};
export default Add;
