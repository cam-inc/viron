import { navigate, PageProps } from 'gatsby';
import { parse } from 'query-string';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import useTheme from '$hooks/theme';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint } from '$types/index';

type Props = PageProps;
const EndpointImportPagge: React.FC<Props> = ({ location }) => {
  useTheme();
  const [, setEndpointList] = useRecoilState(endpointListState);

  const queries = parse(location.search);
  const endpoint: Endpoint = JSON.parse(queries.endpoint as string) as Endpoint;

  useEffect(function () {
    setEndpointList(function (currVal) {
      let { id } = endpoint;
      if (
        !!currVal.find(function (endpoint) {
          return endpoint.id === id;
        })
      ) {
        id = `${id}-${Math.random()}`;
      }
      return [
        ...currVal,
        {
          ...endpoint,
          id,
        },
      ];
    });
    navigate('/home');
  }, []);

  return <div id="page-endpointimport">importing...</div>;
};
export default EndpointImportPagge;
