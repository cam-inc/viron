import classnames from 'classnames';
import _ from 'lodash';
import React from 'react';

type Props = {
  current: number;
  max: number;
  onRequestChange: (num: number) => void;
};
const Pagination: React.FC<Props> = ({ current, max, onRequestChange }) => {
  const handlePageClick = function (num: number) {
    onRequestChange(num);
  };

  return (
    <div>
      {_.times(max, function (num) {
        return (
          <React.Fragment key={num}>
            <Page
              num={num + 1}
              selected={num + 1 === current}
              onClick={handlePageClick}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Pagination;

const Page: React.FC<{
  num: number;
  selected: boolean;
  onClick: (num: number) => void;
}> = ({ num, selected, onClick }) => {
  const handleClick = function () {
    onClick(num);
  };
  return (
    <div
      className={classnames({
        'font-bold': selected,
      })}
      onClick={handleClick}
    >
      {num}
    </div>
  );
};
