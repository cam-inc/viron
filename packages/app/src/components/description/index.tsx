import React from 'react';
import { CommonMark } from '$types/oas';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import classNames from 'classnames';

type Props = {
  on: On;
  value: CommonMark;
  className?: ClassName;
};
const Description: React.FC<Props> = ({ value, on, className = '' }) => {
  const md = require('markdown-it')('commonmark');
  const result = (text: string) => {
    return { __html: md.render(text) };
  };

  return (
    <div
      className={classNames('', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
      dangerouslySetInnerHTML={result(value)}
    />
  );
};

export default Description;
