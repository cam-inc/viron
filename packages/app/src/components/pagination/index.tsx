import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Props as BaseProps } from '~/components';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextOnButton, {
  Props as TextOnButtonProps,
} from '~/components/button/text/on';
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
  const handleFirstClick = useCallback<TextOnButtonProps['onClick']>(() => {
    onRequestChange(1);
  }, [onRequestChange]);

  const handlePrevClick = useCallback<TextOnButtonProps['onClick']>(() => {
    let num: number = current - 1;
    if (num < 1) {
      num = 1;
    }
    onRequestChange(num);
  }, [current, onRequestChange]);

  const handleNextClick = useCallback<TextOnButtonProps['onClick']>(() => {
    let num: number = current + 1;
    if (max < num) {
      num = max;
    }
    onRequestChange(num);
  }, [current, max, onRequestChange]);

  const handleLastClick = useCallback<TextOnButtonProps['onClick']>(() => {
    onRequestChange(max);
  }, [max, onRequestChange]);

  const handlePageClick = useCallback<
    TextOnButtonProps<number>['onClick'] | FilledButtonProps<number>['onClick']
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
          <TextOnButton
            on={on}
            Icon={ChevronDoubleLeftIcon}
            onClick={handleFirstClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <TextOnButton
            on={on}
            Icon={ChevronLeftIcon}
            onClick={handlePrevClick}
          />
        </div>
        {pages.map((page) => (
          <div key={page} className="flex-none mr-2 last:mr-0">
            {page === current ? (
              <FilledButton<number>
                cs={COLOR_SYSTEM.PRIMARY}
                data={page}
                label={page.toString()}
                onClick={handlePageClick}
              />
            ) : (
              <TextOnButton<number>
                on={on}
                data={page}
                label={page.toString()}
                onClick={handlePageClick}
              />
            )}
          </div>
        ))}
        <div className="flex-none mr-2 last:mr-0">
          <TextOnButton
            on={on}
            Icon={ChevronRightIcon}
            onClick={handleNextClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <TextOnButton
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
