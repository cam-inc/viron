import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import ChevronDoubleLeftIcon from '~/components/icon/chevronDoubleLeft/outline';
import ChevronDoubleRightIcon from '~/components/icon/chevronDoubleRight/outline';
import ChevronLeftIcon from '~/components/icon/chevronLeft/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import { Button } from '../ui/button';

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
  const handleFirstClick = useCallback(() => {
    onRequestChange(1);
  }, [onRequestChange]);

  const handlePrevClick = useCallback(() => {
    let num: number = current - 1;
    if (num < 1) {
      num = 1;
    }
    onRequestChange(num);
  }, [current, onRequestChange]);

  const handleNextClick = useCallback(() => {
    let num: number = current + 1;
    if (max < num) {
      num = max;
    }
    onRequestChange(num);
  }, [current, max, onRequestChange]);

  const handleLastClick = useCallback(() => {
    onRequestChange(max);
  }, [max, onRequestChange]);

  const handlePageClick = useCallback(
    (page: number) => {
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
          <Button variant="ghost" size="icon" onClick={handleFirstClick}>
            <ChevronDoubleLeftIcon />
          </Button>
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button variant="ghost" size="icon" onClick={handlePrevClick}>
            <ChevronLeftIcon />
          </Button>
        </div>
        {pages.map((page) => (
          <div key={page} className="flex-none mr-2 last:mr-0">
            {page === current ? (
              <Button onClick={() => handlePageClick(page)}>
                {page.toString()}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => handlePageClick(page)}>
                {page.toString()}
              </Button>
            )}
          </div>
        ))}
        <div className="flex-none mr-2 last:mr-0">
          <Button variant="ghost" size="icon" onClick={handleNextClick}>
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button variant="ghost" size="icon" onClick={handleLastClick}>
            <ChevronDoubleRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
