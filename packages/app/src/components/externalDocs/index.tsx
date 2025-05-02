import { FileTextIcon } from 'lucide-react';
import React from 'react';
import { Props as BaseProps } from '@/components';
import CommonMark from '@/components/commonMark';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ExternalDocumentation } from '@/types/oas';

type Props = BaseProps & {
  data: ExternalDocumentation;
};
const ExternalDocs: React.FC<Props> = ({ data }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="link">
            <Link to={data.url}>
              <FileTextIcon className="w-em" />
              External Docs
            </Link>
          </Button>
        </TooltipTrigger>
        {data.description && (
          <TooltipContent>
            <CommonMark data={data.description} />
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
export default ExternalDocs;
