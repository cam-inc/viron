import React, { useEffect, useMemo, useState } from 'react';

export type Props = {
  file: File;
};
const _File: React.FC<Props> = ({ file }) => {
  const preview = useMemo<JSX.Element>(() => {
    if (file.type.startsWith('image/')) {
      return <PreviewImage file={file} />;
    }
    return <PreviewOthers file={file} />;
  }, [file]);

  return (
    <div className="text-xxs">
      <div>name: {file.name}</div>
      <div>lastModified: {file.lastModified}</div>
      <div>size: {file.size}</div>
      <div>type: {file.type}</div>
      {preview}
    </div>
  );
};
export default _File;

const PreviewImage: React.FC<{ file: File }> = ({ file }) => {
  const [objectURL, setObjectURL] = useState<string | null>(null);
  useEffect(() => {
    const objectURL = globalThis.URL.createObjectURL(file);
    setObjectURL(objectURL);
    const cleanup = () => {
      globalThis.URL.revokeObjectURL(objectURL);
    };
    return cleanup;
  }, [file]);

  if (!objectURL) {
    return null;
  }

  return <img src={objectURL} alt={file.name} />;
};

const PreviewOthers: React.FC<{ file: File }> = ({ file }) => {
  // TODO
  return (
    <div className="text-xxs">
      <div>{file.name}</div>
    </div>
  );
};
