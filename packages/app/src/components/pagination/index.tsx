import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import Button, { Props as ButtonProps } from '~/components/button';
import ChevronDoubleLeftIcon from '~/components/icon/chevronDoubleLeft/outline';
import ChevronDoubleRightIcon from '~/components/icon/chevronDoubleRight/outline';
import ChevronLeftIcon from '~/components/icon/chevronLeft/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import { COLOR_SYSTEM } from '~/types';

export type Props = BaseProps & {
  current: number;
  max: number;
  onRequestChange: (num: number) => void;
};
const Pagination: React.FC<Props> = ({
  on,
  className = '',
  current,
  max,
  onRequestChange,
}) => {
  const handleFirstClick = useCallback<ButtonProps['onClick']>(() => {
    onRequestChange(1);
  }, [onRequestChange]);

  const handlePrevClick = useCallback<ButtonProps['onClick']>(() => {
    let num: number = current - 1;
    if (num < 1) {
      num = 1;
    }
    onRequestChange(num);
  }, [current, onRequestChange]);

  const handleNextClick = useCallback<ButtonProps['onClick']>(() => {
    let num: number = current + 1;
    if (max < num) {
      num = max;
    }
    onRequestChange(num);
  }, [current, max, onRequestChange]);

  const handleLastClick = useCallback<ButtonProps['onClick']>(() => {
    onRequestChange(max);
  }, [max, onRequestChange]);

  const handlePageClick = useCallback<
    ButtonProps<number>['onClick'] | ButtonProps<number>['onClick']
  >(
    (page) => {
      onRequestChange(page);
    },
    [onRequestChange]
  );

  const pages = useMemo<number[]>(() => {
    return _.range(current - 4, current + 4).filter((num) => {
      if (num < 1) {
        return false;
      }
      if (max < num) {
        return false;
      }
      return true;
    });
  }, [current, max]);

  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      <div className="flex items-center">
        <div className="flex-none mr-2 last:mr-0">
          <Button
            variant="text"
            on={on}
            Icon={ChevronDoubleLeftIcon}
            onClick={handleFirstClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button
            variant="text"
            on={on}
            Icon={ChevronLeftIcon}
            onClick={handlePrevClick}
          />
        </div>
        {pages.map((page) => (
          <div key={page} className="flex-none mr-2 last:mr-0">
            {page === current ? (
              <Button<number>
                cs={COLOR_SYSTEM.PRIMARY}
                data={page}
                label={page.toString()}
                onClick={handlePageClick}
              />
            ) : (
              <Button<number>
                variant="text"
                on={on}
                data={page}
                label={page.toString()}
                onClick={handlePageClick}
              />
            )}
          </div>
        ))}
        <div className="flex-none mr-2 last:mr-0">
          <Button
            variant="text"
            on={on}
            Icon={ChevronRightIcon}
            onClick={handleNextClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button
            variant="text"
            on={on}
            Icon={ChevronDoubleRightIcon}
            onClick={handleLastClick}
          />
        </div>
      </div>
    </div>
  );
};
export default Pagination;
