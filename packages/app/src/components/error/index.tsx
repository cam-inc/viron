import React, { useEffect, useState } from 'react';
import { Props as BaseProps } from '~/components';
import { BaseError } from '~/errors';
import { Trans, useTranslation } from '~/hooks/i18n';
import { error as logError, NAMESPACE } from '~/utils/logger';
import { Textarea } from '../ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = BaseProps & {
  error?: BaseError;
  withModal?: boolean;
};

const Error: React.FC<Props> = (props) => {
  const { error, withModal = false } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // log error.
  useEffect(() => {
    if (!error) {
      return;
    }
    logError({
      messages: [error],
      // TODO: namespaceを変えること。
      namespace: NAMESPACE.REACT_COMPONENT,
    });
  }, [error]);

  useEffect(() => {
    if (!error || !withModal) {
      return;
    }
    setOpen(true);
  }, [error, withModal]);

  if (!error) {
    return null;
  }

  return withModal ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{error.name}</DialogTitle>
          <DialogDescription>
            <Trans
              t={t}
              i18nKey="fetchError"
              components={{
                br: <br />,
              }}
            />
          </DialogDescription>
        </DialogHeader>
        {error.message && <Textarea rows={8} value={error.message} readOnly />}
      </DialogContent>
    </Dialog>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>{error.name}</CardTitle>
        <CardDescription>
          <Trans
            t={t}
            i18nKey="fetchError"
            components={{
              br: <br />,
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error.message && <Textarea rows={8} value={error.message} readOnly />}
      </CardContent>
    </Card>
  );
};

export default Error;

export const useError = (
  props: Omit<Props, 'error'>
): {
  setError: (error: BaseError | null) => void;
  bind: Props;
} => {
  const [error, setError] = useState<BaseError | null>(null);

  return {
    setError,
    bind: {
      error: error as Props['error'],
      ...props,
    },
  };
};
