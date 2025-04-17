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

const FORM_ID = 'edit-endpoint-form';

export type Props = {
  onOpenChange: (open: boolean) => void;
  endpoint: Endpoint;
};

const EditEndpoint: React.FC<Props> = ({ onOpenChange, endpoint }) => {
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

  const form = useForm<
    Pick<Endpoint, 'id' | 'url' | 'groupId'> & { manual?: string }
  >({
    resolver: yupResolver(schema),
    defaultValues: endpoint,
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

        //古いIDを第一引数に入力
        const updation = editEndpoint(endpoint.id, data);
        if (updation.error) {
          setError('manual', {
            type: 'manual',
            message: updation.error.name,
          });
          return;
        }

        clearErrors();
        onOpenChange(false);
      }),
    [
      _handleSubmit,
      connect,
      editEndpoint,
      endpoint.id,
      clearErrors,
      onOpenChange,
      setError,
    ]
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('editEndpoint.title')}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form id={FORM_ID} className="space-y-8" onSubmit={handleSubmit}>
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
                <FormLabel>{t('editEndpoint.idInputLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={endpoint.id} {...field} />
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
                <FormLabel>{t('editEndpoint.urlInputLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={endpoint.url} {...field} />
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
                <FormLabel>{t('editEndpoint.groupInputLabel')}</FormLabel>
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
                  {t('editEndpoint.groupInputDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button form={FORM_ID} type="submit">
          {t('editEndpoint.updateButtonLabel')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
export default EditEndpoint;
