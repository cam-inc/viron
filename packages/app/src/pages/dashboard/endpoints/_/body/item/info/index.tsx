import React from 'react';
import CommonMark from '~/components/commonMark';
import Contact from '~/components/contact';
import ExternalDocs from '~/components/externalDocs';
import Head from '~/components/head';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import License from '~/components/license';
import Link from '~/components/link';
import Server from '~/components/server';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document } from '~/types/oas';
import Thumbnail from '../thumbnail';

type Props = {
  endpoint: Endpoint;
  document?: Document;
};
const Info: React.FC<Props> = ({ endpoint, document }) => {
  return (
    <div className="text-thm-on-surface">
      <Head
        on={COLOR_SYSTEM.SURFACE}
        title={
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-em" />
            <div>Information</div>
          </div>
        }
        description="TODO:"
      />
      <div>
        <Thumbnail endpoint={endpoint} document={document} />
        <div>{endpoint.id}</div>
        <div>{endpoint.url}</div>
        {document && (
          <div>
            <div>{document.info.title}</div>
            <div>{document.info.version}</div>
            {document.info.description && (
              <CommonMark
                on={COLOR_SYSTEM.SURFACE}
                data={document.info.description}
              />
            )}
            {document.info.termsOfService && (
              <Link on={COLOR_SYSTEM.SURFACE} to={document.info.termsOfService}>
                <div className="flex items-center gap-1">
                  <ExternalLinkIcon className="w-em" />
                  <div>terms of service</div>
                </div>
              </Link>
            )}
            {document.info.contact && (
              <Contact on={COLOR_SYSTEM.SURFACE} data={document.info.contact} />
            )}
            {document.info.license && (
              <License on={COLOR_SYSTEM.SURFACE} data={document.info.license} />
            )}
            {document.info['x-theme'] && (
              <div>theme: {document.info['x-theme']}</div>
            )}
            {document.info['x-tags'] &&
              document.info['x-tags'].map((tag) => <div>{tag}</div>)}
            {document.servers &&
              document.servers.map((server) => (
                <Server on={COLOR_SYSTEM.SURFACE} server={server} />
              ))}
            {document.externalDocs && (
              <ExternalDocs
                on={COLOR_SYSTEM.SURFACE}
                data={document.externalDocs}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Info;
