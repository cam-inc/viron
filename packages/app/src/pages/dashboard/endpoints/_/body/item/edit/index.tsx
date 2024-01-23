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
  endpoint: Endpoint;
};

const EditEndpoint: React.FC<Props> = ({
  className = '',
  onAdd,
  onCancel,
  endpoint,
}) => {
  const { t } = useTranslation();
  const { groupList, connect, editEndpoint } = useEndpoint();

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

        //古いIDを第一引数に入力
        const updation = await editEndpoint(endpoint.id, data);
        if (updation.error) {
          setError('manual', {
            type: 'manual',
            message: updation.error.name,
          });
          return;
        }

        clearErrors();
        onAdd();
      }),
    [_handleSubmit, connect, editEndpoint, clearErrors, onAdd, setError]
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
          title={t('editEndpoint.title')}
        />
        <div>{formState.errors.manual?.message}</div>
        <div className="space-y-8">
          <Textinput.renewal
            type="text"
            label={t('editEndpoint.idInputLabel')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.id}
            render={(bind) => (
              <input
                placeholder={endpoint.id}
                defaultValue={endpoint.id}
                {...bind}
                {...register('id')}
              />
            )}
          />
          <Textinput.renewal
            type="text"
            label={t('editEndpoint.urlInputLabel')}
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.url}
            render={(bind) => (
              <input
                placeholder={endpoint.url}
                defaultValue={endpoint.url}
                {...bind}
                {...register('url')}
              />
            )}
          />
          <Select.renewal<EndpointGroup>
            on={COLOR_SYSTEM.SURFACE}
            label={t('editEndpoint.groupInputLabel')}
            description={t('editEndpoint.groupInputDescription')}
            list={groupList}
            Select={({ id, className, children }) => (
              <select
                id={id}
                className={className}
                defaultValue={endpoint.groupId}
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
            label={t('editEndpoint.cancelButtonLabel')}
            onClick={onCancel}
          />
          <Button
            type="submit"
            cs={COLOR_SYSTEM.PRIMARY}
            label={t('editEndpoint.updateButtonLabel')}
            onClick={handleCreateClick}
          />
        </div>
      </form>
    </div>
  );
};
export default EditEndpoint;
