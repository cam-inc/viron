import React, { useCallback } from 'react';
import FileReader, { Props as FileReaderProps } from '$components/fileReader';

export type Props = {
  onChange: (base64: string | null) => void;
};
const Base64Reader: React.FC<Props> = ({ onChange }) => {
  const handleFileReaderChange = useCallback<FileReaderProps['onChange']>(
    async (file) => {
      if (!file) {
        onChange(null);
        return;
      }
      const reader = new globalThis.FileReader();
      reader.addEventListener('load', () => {
        const base64 = reader.result as string;
        onChange(base64);
      });
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div>
      <FileReader onChange={handleFileReaderChange} />
    </div>
  );
};
export default Base64Reader;
