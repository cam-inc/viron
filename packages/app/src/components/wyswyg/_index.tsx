import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';
import classnames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Props as BaseProps } from '~/components';

export type Props = BaseProps & {
  initialData?: OutputData;
  readOnly?: boolean;
  onChange: NonNullable<EditorConfig['onChange']>;
};
const Wyswyg: React.FC<Props> = ({
  className = '',
  initialData,
  readOnly = false,
  onChange,
}) => {
  const [editor, setEditor] = useState<EditorJS | null>(null);

  const holder = useMemo<string>(() => `editor-${Date.now().toString()}`, []);

  useEffect(() => {
    const editor = new EditorJS({
      holder,
      data: initialData,
      readOnly,
      onChange,
    });
    editor.isReady
      .then(() => {
        console.log('editor is ready to work.');
      })
      .catch((error) => {
        // TODO: エラー処理
        console.error(error);
      });
    setEditor(editor);
  }, []);

  // Dynamically change some Editor.js properties.
  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.isReady.then(() => {
      // Force update the onChange callback even though Editor.js doesn't expose the property configuration as public one.
      // @ts-ignore
      editor.configuration.onChange = onChange;
    });
  }, [editor, onChange]);

  return (
    <div
      id={holder}
      className={classnames(`border-2 border-border`, className)}
    />
  );
};
export default Wyswyg;
