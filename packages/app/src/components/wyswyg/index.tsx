import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';
import classnames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { On, ON } from '$constants/index';
import { ClassName } from '$types/index';

export type Props = {
  on: On;
  className?: ClassName;
  initialData?: OutputData;
  readOnly?: boolean;
  onChange: NonNullable<EditorConfig['onChange']>;
};
const Wyswyg: React.FC<Props> = ({
  on,
  className = '',
  initialData,
  readOnly = false,
  onChange,
}) => {
  const holder = useMemo<string>(function () {
    return `editor-${Date.now().toString()}`;
  }, []);
  useEffect(
    function () {
      const editor = new EditorJS({
        holder,
        data: initialData,
        readOnly,
        onChange,
      });
      editor.isReady
        .then(function () {
          console.log('editor is ready to work.');
        })
        .catch(function (error) {
          // TODO: エラー処理
          console.error(error);
        });
    },
    [holder, initialData, readOnly, onChange]
  );

  return (
    <div
      id={holder}
      className={classnames(
        'border-2',
        {
          'border-on-background': on === ON.BACKGROUND,
          'border-on-surface': on === ON.SURFACE,
          'border-on-primary': on === ON.PRIMARY,
          'border-on-complementary': on === ON.COMPLEMENTARY,
        },
        className
      )}
    />
  );
};
export default Wyswyg;
