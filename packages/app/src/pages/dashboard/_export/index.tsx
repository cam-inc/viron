import { BiShareAlt } from '@react-icons/all-files/bi/BiShareAlt';
import React from 'react';
import { useRecoilState } from 'recoil';
import Button, {
  SIZE as BUTTON_SIZE,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import { ON } from '$constants/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { ClassName, EndpointForDistribution } from '$types/index';

type Props = {
  className?: ClassName;
};
const Export: React.FC<Props> = ({ className = '' }) => {
  const [endpointList] = useRecoilState(endpointListState);

  const handleClick = function () {
    // Omit some data to minimize the json file size.
    const data: EndpointForDistribution[] = endpointList.map(function (
      endpoint
    ) {
      return {
        ...endpoint,
        authConfigs: null,
        document: null,
      };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const blobURL = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('download', 'endpoints.json');
    anchorElement.href = blobURL;
    anchorElement.style.display = 'none';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    // clean up.
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(blobURL);
  };

  return (
    <Button
      on={ON.PRIMARY}
      variant={BUTTON_VARIANT.TEXT}
      size={BUTTON_SIZE.SM}
      Icon={BiShareAlt}
      label="Share"
      className={className}
      onClick={handleClick}
    />
  );
};
export default Export;
