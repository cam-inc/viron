import { PageProps, graphql } from 'gatsby';
import { QrCodeIcon } from 'lucide-react';
import { parse } from 'query-string';
import React, { useCallback, useState, useEffect } from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Error, { useError } from '~/components/error';
import Metadata from '~/components/metadata';
import Spinner from '~/components/spinner';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { BaseError } from '~/errors';
import { useEndpoint } from '~/hooks/endpoint';
import { useI18n } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import { COLOR_SYSTEM, Endpoint } from '~/types';

type Props = PageProps;
const EndpointImportPagge: React.FC<Props> = ({ location }) => {
  useTheme();
  const { navigate } = useI18n();

  const { connect, addEndpoint } = useEndpoint();
  const error = useError({ on: COLOR_SYSTEM.SURFACE, withModal: true });
  const setError = error.setError;
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    setError(null);
    setIsPending(true);

    const queries = parse(location.search);
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
  }, [addEndpoint, connect, setError, location.search]);

  const handleButtonClick = useCallback(async () => {
    await navigate('/dashboard/endpoints');
  }, [navigate]);

  return (
    <>
      <Metadata title="Import" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="justify-center">
          {isPending ? (
            <div className="flex justify-center">
              <Spinner className="size-8" on={COLOR_SYSTEM.BACKGROUND} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 justify-center">
              <div className="flex flex-col items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <QrCodeIcon className="size-6" />
                </div>
              </div>
              <h1 className="text-xl font-bold">
                Have completed importing an endpoint successfully.
              </h1>
              <div className="text-center text-sm flex items-center gap-2">
                <button
                  className="underline underline-offset-4"
                  onClick={handleButtonClick}
                >
                  Go back to the dashboard{' '}
                </button>
                <span>to continue.</span>
              </div>
            </div>
          )}
          <Error {...error.bind} withModal />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default EndpointImportPagge;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
