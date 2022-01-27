import React, { useCallback } from 'react';
import FileReader, { Props as FileReaderProps } from '~/components/fileReader';

export type Props = {
  onChange: (arrayBuffer: ArrayBuffer | null) => void;
};
const ArrayBufferReader: React.FC<Props> = ({ onChange }) => {
  const handleFileReaderChange = useCallback<FileReaderProps['onChange']>(
    async (file) => {
      if (!file) {
        onChange(null);
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      onChange(arrayBuffer);
    },
    [onChange]
  );

  return (
    <div>
      <FileReader onChange={handleFileReaderChange} />
    </div>
  );
};
export default ArrayBufferReader;
