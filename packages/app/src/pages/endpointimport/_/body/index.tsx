import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import Error, { useError } from '~/components/error';
import Spinner from '~/components/spinner';
import { BaseError } from '~/errors/index';
import { useEndpoint } from '~/hooks/endpoint';
import { useI18n } from '~/hooks/i18n';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM, Endpoint } from '~/types';

export type Props = Parameters<LayoutProps['renderBody']>[0] & {
  search: string;
};
const Body: React.FC<Props> = ({ style, className = '', search }) => {
  const { navigate } = useI18n();
  const { connect, addEndpoint } = useEndpoint();
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
  const setError = error.setError;
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    setError(null);
    setIsPending(true);

    const queries = parse(search);
    let endpoint: Endpoint;
    try {
      endpoint = JSON.parse(queries.endpoint as string) as Endpoint;
    } catch {
      setError(new BaseError('Broken endpoint data.'));
      setIsPending(false);
      return;
    }

    const f = async () => {
      const connection = await connect(endpoint.url);
      if (connection.error) {
        setError(connection.error);
        setIsPending(false);
        return;
      }
      const addition = await addEndpoint(endpoint, {
        resolveDuplication: true,
      });
      if (addition.error) {
        setError(addition.error);
        setIsPending(false);
        return;
      }
      setError(null);
      setIsPending(false);
    };
    f();
  }, [addEndpoint, connect, setError, search]);

  const handleButtonClick = useCallback<ButtonProps['onClick']>(() => {
    navigate('/dashboard/endpoints');
  }, [navigate]);

  if (isPending) {
    return (
      <div style={style} className={className}>
        <div className="p-4">
          <Spinner className="w-8" on={COLOR_SYSTEM.BACKGROUND} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={style} className={className}>
        <div className="p-4">
          <div>
            Have completed importing an endpoint successfully.{' '}
            <Button
              cs={COLOR_SYSTEM.PRIMARY}
              label="Go back to the dashboard"
              onClick={handleButtonClick}
            />{' '}
            to continue.
          </div>
        </div>
      </div>
      <Error.renewal {...error.bind} withModal={true} />
    </>
  );
};
export default Body;
