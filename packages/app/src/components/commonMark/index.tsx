import classnames from 'classnames';
import markdownit from 'markdown-it';
import React, { useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import { CommonMark } from '~/types/oas';

type Props = BaseProps & {
  data: CommonMark;
};
const _CommonMark: React.FC<Props> = ({ on, data, className = '' }) => {
  const parsedDescription = useMemo(() => {
    const md = markdownit('commonmark');
    return { __html: md.render(data) };
  }, [data]);

  return (
    <div
      className={classnames(`text-xs`, className)}
      dangerouslySetInnerHTML={parsedDescription}
    />
  );
};
export default _CommonMark;
