import classNames from 'classnames';
import markdownit from 'markdown-it';
import React, { useMemo } from 'react';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import { CommonMark } from '$types/oas';

type Props = {
  on: On;
  value: string | CommonMark;
  className?: ClassName;
};

const Description: React.FC<Props> = ({ on, value, className = '' }) => {
  const parsedDescription = useMemo(
    function () {
      const md = markdownit('commonmark');
      return { __html: md.render(value) };
    },
    [value]
  );
  return (
    <div
      className={classNames(className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
      dangerouslySetInnerHTML={parsedDescription}
    />
  );
};

export default Description;
