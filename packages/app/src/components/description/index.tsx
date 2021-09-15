import React from 'react';
import { CommonMark as CommonMarkType } from '$types/oas';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import classNames from 'classnames';

type Props = {
  on: On;
  value: CommonMarkType;
  className?: ClassName;
};

const md = require('markdown-it')('commonmark');
const getParsedResult = (commonMarkText: CommonMarkType) => {
  return { __html: md.render(commonMarkText) };
};
const Description: React.FC<Props> = ({ value, on, className = '' }) => {
  return (
    <div
      className={classNames(className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
      dangerouslySetInnerHTML={getParsedResult(value)}
    />
  );
};

export default Description;
