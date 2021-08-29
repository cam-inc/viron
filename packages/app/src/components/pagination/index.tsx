import { BiChevronLeft } from '@react-icons/all-files/bi/BiChevronLeft';
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { BiChevronsLeft } from '@react-icons/all-files/bi/BiChevronsLeft';
import { BiChevronsRight } from '@react-icons/all-files/bi/BiChevronsRight';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Button, {
  Props as ButtonProps,
  VARIANT as BUTTON_VARIANT,
} from '$components/button';
import { On } from '$constants/index';

type Props = {
  on: On;
  current: number;
  max: number;
  onRequestChange: (num: number) => void;
};
const Pagination: React.FC<Props> = ({ on, current, max, onRequestChange }) => {
  const handleFirstClick = useCallback(
    function () {
      onRequestChange(1);
    },
    [onRequestChange]
  );

  const handlePrevClick = useCallback(
    function () {
      let num: number = current - 1;
      if (num < 1) {
        num = 1;
      }
      onRequestChange(num);
    },
    [current, onRequestChange]
  );

  const handleNextClick = useCallback(
    function () {
      let num: number = current + 1;
      if (max < num) {
        num = max;
      }
      onRequestChange(num);
    },
    [current, max, onRequestChange]
  );

  const handleLastClick = useCallback(
    function () {
      onRequestChange(max);
    },
    [max, onRequestChange]
  );

  const handlePageClick = useCallback<
    NonNullable<ButtonProps<number>['onClick']>
  >(
    function (num) {
      onRequestChange(num);
    },
    [onRequestChange]
  );

  const pages = useMemo<number[]>(
    function () {
      return _.range(current - 4, current + 4).filter(function (num) {
        if (num < 1) {
          return false;
        }
        if (max < num) {
          return false;
        }
        return true;
      });
    },
    [current, max]
  );

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-none mr-2 last:mr-0">
          <Button
            on={on}
            variant={BUTTON_VARIANT.TEXT}
            Icon={BiChevronsLeft}
            onClick={handleFirstClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button
            on={on}
            variant={BUTTON_VARIANT.TEXT}
            Icon={BiChevronLeft}
            onClick={handlePrevClick}
          />
        </div>
        {pages.map(function (page) {
          return (
            <div key={page} className="flex-none mr-2 last:mr-0">
              <Button
                on={on}
                variant={
                  page === current ? BUTTON_VARIANT.PAPER : BUTTON_VARIANT.TEXT
                }
                label={page.toString()}
                data={page}
                onClick={handlePageClick}
              />
            </div>
          );
        })}
        <div className="flex-none mr-2 last:mr-0">
          <Button
            on={on}
            variant={BUTTON_VARIANT.TEXT}
            Icon={BiChevronRight}
            onClick={handleNextClick}
          />
        </div>
        <div className="flex-none mr-2 last:mr-0">
          <Button
            on={on}
            variant={BUTTON_VARIANT.TEXT}
            Icon={BiChevronsRight}
            onClick={handleLastClick}
          />
        </div>
      </div>
    </div>
  );
};
export default Pagination;
