import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import OutlineButton, {
  Props as OutlineButtonProps,
} from '~/components/button/outline';
import Select from '~/components/select';
import Textinput from '~/components/textinput';
import { useEndpoint } from '~/hooks/endpoint';
import { ClassName, COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import { endpointId, url } from '~/utils/v8n';

export type Props = {
  className?: ClassName;
  onAdd: () => void;
  onCancelClick: () => void;
};
const AddEndpoint: React.FC<Props> = ({
  className = '',
  onAdd,
  onCancelClick,
}) => {
  const { groupList, addEndpoint } = useEndpoint();

  type Data = Pick<Endpoint, 'id' | 'url' | 'groupId'> & { manual?: string };
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
  } = useForm<Data>({
    resolver: yupResolver(schema),
  });
  const handleSubmit = useMemo(
    () =>
      _handleSubmit(async (data) => {
        const result = await addEndpoint(data);
        if (result.error) {
          setError('manual', {
            type: 'manual',
            message: result.error.name,
          });
          return;
        }
        clearErrors();
        onAdd();
      }),
    [setError, clearErrors, onAdd]
  );

  const handleCreateClick = useCallback<FilledButtonProps['onClick']>(() => {
    // nothing to do...
  }, []);
  const handleCancelClick = useCallback<OutlineButtonProps['onClick']>(() => {
    onCancelClick();
  }, [onCancelClick]);

  return (
    <div className={className}>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div>
          <div className="text-thm-on-surface">Create an Endpoint.</div>
        </div>
        <div>{formState.errors.manual?.message}</div>
        <div className="space-y-2">
          <Textinput
            type="text"
            label="ID"
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.id}
            render={(bind) => <input {...bind} {...register('id')} />}
          />
          <Textinput
            type="text"
            label="URL"
            on={COLOR_SYSTEM.SURFACE}
            error={formState.errors.id}
            render={(bind) => <input {...bind} {...register('url')} />}
          />
          <Select<EndpointGroup>
            on={COLOR_SYSTEM.SURFACE}
            list={groupList}
            Select={({ className, children }) => (
              <select
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
          />
        </div>
        <div className="flex justify-end gap-2">
          <OutlineButton
            cs={COLOR_SYSTEM.PRIMARY}
            size={BUTTON_SIZE.BASE}
            label="Cancel"
            onClick={handleCancelClick}
          />
          <FilledButton
            type="submit"
            cs={COLOR_SYSTEM.PRIMARY}
            size={BUTTON_SIZE.BASE}
            label="Create"
            onClick={handleCreateClick}
          />
        </div>
      </form>
    </div>
  );
};
export default AddEndpoint;
