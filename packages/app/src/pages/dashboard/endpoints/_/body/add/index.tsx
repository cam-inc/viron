import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import Button, { Props as ButtonProps } from '~/components/button';
import Head from '~/components/head';
import Select from '~/components/select';
import Textinput from '~/components/textinput';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { ClassName, COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import { endpointId, url } from '~/utils/v8n';

export type Props = {
  className?: ClassName;
  onAdd: () => void;
  onCancel: () => void;
};
const AddEndpoint: React.FC<Props> = ({ className = '', onAdd, onCancel }) => {
  const { t } = useTranslation();
  const { groupList, connect, addEndpoint } = useEndpoint();

  const schema = useMemo(
    () =>
      yup.object().shape({
        id: endpointId.required(),
        url: url.required(),
      }),
    []
  );
  const {
    register,
    handleSubmit: _handleSubmit,
    formState,
    setError,
    clearErrors,
    watch,
  } = useForm<Pick<Endpoint, 'id' | 'url' | 'groupId'> & { manual?: string }>({
    resolver: yupResolver(schema),
  });
  const handleSubmit = useMemo(
    () =>
      _handleSubmit(async (data) => {
        const connection = await connect(data.url);
        if (connection.error) {
          setError('manual', {
            type: 'manual',
            message: connection.error.name,
          });
          return;
        }
        const addition = await addEndpoint(data);
        if (addition.error) {
          setError('manual', {
            type: 'manual',
            message: addition.error.name,
          });
          return;
        }
        clearErrors();
        onAdd();
      }),
    [_handleSubmit, connect, addEndpoint, clearErrors, onAdd, setError]
  );

  const handleCreateClick = useCallback<ButtonProps['onClick']>(() => {
    // nothing to do...
  }, []);

  return (
    <div className={className}>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <Head
          className="pb-3 mb-8 border-b border-thm-on-surface-faint"
          on={COLOR_SYSTEM.SURFACE}
          title={t('addEndpoint.title')}
        />
        <div>{formState.errors.manual?.message}</div>
        <div className="space-y-8">
          <Textinput.renewal
            type="text"
            label={t('addEndpoint.idInputLabel')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.id}
            render={(bind) => (
              <input
                placeholder={t('addEndpoint.idInputPlaceholder')}
                {...bind}
                {...register('id')}
              />
            )}
          />
          <Textinput.renewal
            type="text"
            label={t('addEndpoint.urlInputLabel')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.url}
            render={(bind) => (
              <input
                placeholder={t('addEndpoint.urlInputPlaceholder')}
                {...bind}
                {...register('url')}
              />
            )}
          />
          <Select.renewal<EndpointGroup>
            on={COLOR_SYSTEM.SURFACE}
            label={t('addEndpoint.groupInputLabel')}
            description={t('addEndpoint.groupInputDescription')}
            list={groupList}
            Select={({ id, className, children }) => (
              <select
                id={id}
                className={className}
                value={watch('groupId')}
                {...register('groupId')}
              >
                {children}
              </select>
            )}
            Option={({ className, data }) => (
              <option className={className} value={data.id}>
                {data.name}
              </option>
            )}
            OptionBlank={({ className }) => (
              <option className={className}>-</option>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="text"
            on={COLOR_SYSTEM.SURFACE}
            label={t('addEndpoint.cancelButtonLabel')}
            onClick={onCancel}
          />
          <Button
            type="submit"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('addEndpoint.addButtonLabel')}
            onClick={handleCreateClick}
          />
        </div>
      </form>
    </div>
  );
};
export default AddEndpoint;
