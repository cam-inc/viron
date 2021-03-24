import { navigate, PageProps } from 'gatsby';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { oneState as endpointOneState } from '$store/selectors/endpoint';
import { EndpointID } from '$types/index';

type Props = PageProps;
const OAuthRedirectPage: React.FC<Props> = ({ params, location }) => {
  const endpointId = params.endpointId as EndpointID;
  const [endpoint, setEndpoint] = useRecoilState(
    endpointOneState({ id: endpointId })
  );

  useEffect(
    function () {
      const token = new URL(location.href).searchParams.get('token');
      if (!endpointId || !token) {
        // TODO: show error.
        return;
      }
      if (!endpoint) {
        // TODO: show error.
        return;
      }
      setEndpoint(function (currVal) {
        if (!currVal) {
          return currVal;
        }
        return {
          ...currVal,
          token,
        };
      });
      navigate(`/endpoints/${endpointId}`);
    },
    [endpoint, endpointId, setEndpoint]
  );

  return <p>Processing OAuth redirection...</p>;
};
export default OAuthRedirectPage;
