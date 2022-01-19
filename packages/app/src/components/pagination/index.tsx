import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import ChevronDoubleLeftIcon from '~/components/icon/chevronDoubleLeft/outline';
import ChevronDoubleRightIcon from '~/components/icon/chevronDoubleRight/outline';
import ChevronLeftIcon from '~/components/icon/chevronLeft/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';

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
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onRequestChange(Number(e.currentTarget.dataset.page));
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

  // TODO: ボタン
  return (
    <div className={classnames(`text-thm-on-${on}`, className)}>
      <div className="flex items-center">
        <div className="flex-none mr-2 last:mr-0">
          <button onClick={handleFirstClick}>
            <ChevronDoubleLeftIcon className="w-em" />
          </button>
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <button onClick={handlePrevClick}>
            <ChevronLeftIcon className="w-em" />
          </button>
        </div>
        {pages.map((page) => (
          <div key={page} className="flex-none mr-2 last:mr-0">
            <button data-page={page} onClick={handlePageClick}>
              {page.toString()}
            </button>
          </div>
        ))}
        <div className="flex-none mr-2 last:mr-0">
          <button onClick={handleNextClick}>
            <ChevronRightIcon className="w-em" />
          </button>
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <button onClick={handleLastClick}>
            <ChevronDoubleRightIcon className="w-em" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
