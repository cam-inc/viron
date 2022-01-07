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
import Textinput from '~/components/textinput';
import { useEndpoint } from '~/hooks/endpoint';
import { COLOR_SYSTEM, EndpointGroup } from '~/types';

export type Props = {
  onAdd: () => void;
  onCancelClick: () => void;
};
const AddGroup: React.FC<Props> = ({ onAdd, onCancelClick }) => {
  const { addGroup } = useEndpoint();
  const schema = useMemo(
    () =>
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
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
            message: error.message,
          });
          return;
        }
        clearErrors();
        onAdd();
      }),
    [onAdd, setError, clearErrors]
  );

  const handleCreateClick = useCallback<FilledButtonProps['onClick']>(() => {
    // nothing to do...
  }, []);

  const handleCancelClick = useCallback<OutlineButtonProps['onClick']>(() => {
    onCancelClick();
  }, [onCancelClick]);

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div>
        <div className="text-thm-on-surface">Create an Endpoint Group</div>
      </div>
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
          label="Name"
          on={COLOR_SYSTEM.SURFACE}
          error={formState.errors.name}
          render={(bind) => <input {...bind} {...register('name')} />}
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
  );
};
export default AddGroup;
