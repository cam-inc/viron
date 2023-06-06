import React from 'react';
import CommonMark from '~/components/commonMark';
import Contact from '~/components/contact';
import ExternalDocs from '~/components/externalDocs';
import Head from '~/components/head';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import InformationCircleIcon from '~/components/icon/informationCircle/outline';
import ServerIcon from '~/components/icon/server/outline';
import TagIcon from '~/components/icon/tag/outline';
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
      <div className="pb-4 mb-4 border-b border-thm-on-surface-slight">
        <Head
          on={COLOR_SYSTEM.SURFACE}
          title={
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="w-em" />
              <div>Information</div>
            </div>
          }
        />
      </div>
      <div>
        <div className="flex gap-4 items-center">
          <div className="flex-none">
            <Thumbnail endpoint={endpoint} document={document} />
          </div>
          <div className="flex-1">
            <div className="text-xxs text-thm-on-surface-low">
              {endpoint.id}
            </div>
            <div className="text-thm-on-surface text-xs font-bold">
              {document?.info.title || '---'}
            </div>
            <div className="text-xxs text-thm-on-surface-low">
              {endpoint.url}
            </div>
          </div>
        </div>
        {document && (
          <div className="pt-4 mt-4 border-t border-dashed border-thm-on-surface-slight">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-base text-thm-on-surface-high font-bold whitespace-nowrap truncate">
                  {document.info.title}
                </div>
                <div className="flex items-center gap-1 text-xs text-thm-on-surface-low">
                  <ServerIcon className="w-em" />
                  <div>{endpoint.url}</div>
                </div>
                {document.info['x-tags'] && (
                  <ul className="flex items-center gap-2 mt-1">
                    {document.info['x-tags'].map((tag) => (
                      <li
                        key={tag}
                        className="flex items-center gap-1 text-thm-on-surface-low text-xxs border rounded border-thm-on-surface-low px-1"
                      >
                        <TagIcon className="w-em" />
                        <div>{tag}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex-none flex flex-col items-end gap-1">
                <div className="flex-none px-1 rounded border border-thm-on-surface-slight">
                  <span className="text-xxs text-thm-on-surface-low mr-1">
                    version
                  </span>
                  <span className="text-xs">{document.info.version}</span>
                </div>
                {document.info['x-theme'] && (
                  <div className="flex-none px-1 rounded border border-thm-on-surface-slight">
                    <span className="text-xxs text-thm-on-surface-low mr-1">
                      theme
                    </span>
                    <span className="text-xs">{document.info['x-theme']}</span>
                  </div>
                )}
              </div>
            </div>
            {document.info.description && (
              <div className="my-4">
                <CommonMark
                  on={COLOR_SYSTEM.SURFACE}
                  data={document.info.description}
                />
              </div>
            )}
            <div className="flex flex-col items-start gap-1">
              {document.info.termsOfService && (
                <Link
                  className="group focus:outline-none"
                  to={document.info.termsOfService}
                >
                  <div className="flex gap-1 items-center text-xs text-thm-on-surface group-hover:underline group-active:text-thm-on-surface-low group-focus:ring-2 group-focus:ring-thm-on-surface">
                    <ExternalLinkIcon className="w-em" />
                    <div>terms of service</div>
                  </div>
                </Link>
              )}
              {document.info.contact && (
                <Contact
                  on={COLOR_SYSTEM.SURFACE}
                  data={document.info.contact}
                />
              )}

              {document.info.license && (
                <License
                  on={COLOR_SYSTEM.SURFACE}
                  data={document.info.license}
                />
              )}
              {document.externalDocs && (
                <ExternalDocs
                  on={COLOR_SYSTEM.SURFACE}
                  data={document.externalDocs}
                />
              )}
              {document.servers && (
                <ul className="flex flex-col items-start gap-1">
                  {document.servers.map((server) => (
                    <li key={server.url}>
                      <Server on={COLOR_SYSTEM.SURFACE} server={server} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Info;
