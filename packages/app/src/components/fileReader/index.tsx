import React, { useCallback, useMemo, useState } from 'react';
import _File from '~/components/file';

export type Props = {
  onChange: (file: File | null) => void;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, 'accept'>;
const _FileReader: React.FC<Props> = ({ accept, onChange }) => {
  const id = useMemo(() => {
    return `fileReader-${Math.random()}`;
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const update = useCallback(
    (file: File | null) => {
      setFile(file);
      onChange(file);
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.currentTarget;
      if (!files) {
        update(null);
        return;
      }
      const [file] = files;
      if (!file) {
        update(null);
        return;
      }
      update(file);
    },
    [update]
  );

  return (
    <div>
      {file && <_File file={file} />}
      <label htmlFor={id}>Select</label>
      <input
        id={id}
        className="hidden"
        type="file"
        accept={accept}
        onChange={handleChange}
      />
    </div>
  );
};
export default _FileReader;
