import React, { useCallback } from 'react';
import FileReader, { Props as FileReaderProps } from '~/components/fileReader';

export type Props = {
  onChange: (binaryString: string | null) => void;
};
const BinaryReader: React.FC<Props> = ({ onChange }) => {
  const handleFileReaderChange = useCallback<FileReaderProps['onChange']>(
    async (file) => {
      if (!file) {
        onChange(null);
        return;
      }
      const reader = new globalThis.FileReader();
      reader.addEventListener('load', () => {
        const binaryString = reader.result as string;
        onChange(binaryString);
      });
      reader.readAsBinaryString(file);
    },
    [onChange]
  );

  return (
    <div>
      <FileReader onChange={handleFileReaderChange} />
    </div>
  );
};
export default BinaryReader;
