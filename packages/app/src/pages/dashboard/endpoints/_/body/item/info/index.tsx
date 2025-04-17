import { Tag } from 'lucide-react';
import React from 'react';
import CommonMark from '~/components/commonMark';
import Contact from '~/components/contact';
import ExternalDocs from '~/components/externalDocs';
import ExternalLinkIcon from '~/components/icon/externalLink/outline';
import License from '~/components/license';
import Link from '~/components/link';
import Server from '~/components/server';
import { Badge } from '~/components/ui/badge';
import { DialogContent, DialogHeader } from '~/components/ui/dialog';
import { useTranslation } from '~/hooks/i18n';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import { Document } from '~/types/oas';
import Thumbnail from '../thumbnail';

type Props = {
  endpoint: Endpoint;
  document?: Document;
};
const Info: React.FC<Props> = ({ endpoint, document }) => {
  const { t } = useTranslation();

  return (
    <DialogContent>
      <DialogHeader>{t('endpointInformation.title')}</DialogHeader>
      <div className="flex gap-4 items-center">
        <Thumbnail
          className="w-12 h-12 flex-none"
          endpoint={endpoint}
          document={document}
        />
        <div className="text-xl font-bold">{endpoint.id}</div>
      </div>
      {document && (
        <>
          <dl className="grid gap-2">
            <div className="flex">
              <dt className="text-muted-foreground text-sm w-1/4">Title</dt>
              <dd className="w-3/4">{document.info.title}</dd>
            </div>
            <div className="flex">
              <dt className="text-muted-foreground text-sm w-1/4">Url</dt>
              <dd className="w-3/4">{endpoint.url}</dd>
            </div>
            <div className="flex">
              <dt className="text-muted-foreground text-sm w-1/4">Tags</dt>
              <dd className="w-3/4">
                {document.info['x-tags']?.map((tag) => (
                  <Badge variant="outline" key={tag}>
                    <Tag className="h-3 w-3 mr-1.5" />
                    {tag}
                  </Badge>
                )) ?? '-'}
              </dd>
            </div>
            <div className="flex">
              <dt className="text-muted-foreground text-sm w-1/4">Version</dt>
              <dd className="w-3/4">{document.info.version}</dd>
            </div>
            <div className="flex">
              <dt className="text-muted-foreground text-sm w-1/4">Theme</dt>
              <dd className="w-3/4">{document.info['x-theme'] ?? '-'}</dd>
            </div>
          </dl>
          <div className="">
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
        </>
      )}
    </DialogContent>
  );
};
export default Info;
