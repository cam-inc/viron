import { FileTextIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '~/components';
import CommonMark from '~/components/commonMark';
import Link from '~/components/link';
import { ExternalDocumentation } from '~/types/oas';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = BaseProps & {
  data: ExternalDocumentation;
};
const ExternalDocs: React.FC<Props> = ({ on, data }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link className="group focus-outline-none" to={data.url}>
            <div
              className={`flex gap-1 items-center text-xs text-thm-on-${on} group-hover:underline group-active:text-thm-on-${on}-low group-focus:ring-2 group-focus:ring-thm-on-${on}`}
            >
              <FileTextIcon className="w-em" />
              <div>External Docs</div>
            </div>
          </Link>
        </TooltipTrigger>
        {data.description && (
          <TooltipContent>
            <CommonMark on={on} data={data.description} />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
export default ExternalDocs;
