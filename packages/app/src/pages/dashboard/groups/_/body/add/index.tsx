import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEndpoint } from '@/hooks/endpoint';
import { useTranslation } from '@/hooks/i18n';
import { EndpointGroup } from '@/types';

const FORM_ID = 'add-group-form';

export type Props = {
  onAdd: () => void;
};
const Add: React.FC<Props> = ({ onAdd }) => {
  const { addGroup } = useEndpoint();
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    []
  );
  const form = useForm<EndpointGroup & { manual?: string }>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
    },
    shouldUnregister: true,
  });
  const { handleSubmit: _handleSubmit, setError, clearErrors } = form;
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

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('createGroup.head.title')}</DialogTitle>
        <DialogDescription>
          {t('createGroup.head.description')}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form id={FORM_ID} className="space-y-4 py-4" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createGroup.idFormLabel')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createGroup.nameFormLabel')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('createGroup.descriptionFormLabel')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button form={FORM_ID} type="submit">
          {t('createGroup.addButtonLabel')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
export default Add;
