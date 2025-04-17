import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle } from 'lucide-react';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { Endpoint } from '~/types';
import { endpointId, url } from '~/utils/v8n';

const FORM_ID = 'add-endpoint-form';

export type Props = {
  onAdd: () => void;
};
const AddEndpoint: React.FC<Props> = ({ onAdd }) => {
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
  const form = useForm<
    Pick<Endpoint, 'id' | 'url' | 'groupId'> & { manual?: string }
  >({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit: _handleSubmit,
    formState,
    setError,
    clearErrors,
  } = form;
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

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('addEndpoint.title')}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form id={FORM_ID} className="space-y-4 py-4" onSubmit={handleSubmit}>
          {formState.errors.manual?.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {formState.errors.manual.message}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addEndpoint.idInputLabel')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('addEndpoint.idInputPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addEndpoint.urlInputLabel')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('addEndpoint.urlInputPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addEndpoint.groupInputLabel')}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/** @see https://github.com/radix-ui/primitives/issues/1569 */}
                      <SelectItem value={undefined as any}>-</SelectItem>
                      {groupList.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  {t('addEndpoint.groupInputDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button form={FORM_ID} type="submit">
          {t('addEndpoint.addButtonLabel')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
export default AddEndpoint;
