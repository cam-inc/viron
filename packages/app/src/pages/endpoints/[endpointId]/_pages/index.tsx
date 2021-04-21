import { AiOutlineDown } from '@react-icons/all-files/ai/AiOutlineDown';
import { AiOutlineRight } from '@react-icons/all-files/ai/AiOutlineRight';
import classnames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Info } from '$types/oas';

type Partial = {
  group: string;
  children: (string | Partial)[];
};

type Props = {
  pages: Info['x-pages'];
  selectedPageIds: Info['x-pages'][number]['id'][];
  onSelect: (pageId: Info['x-pages'][number]['id'], separate: boolean) => void;
};
const _Pages: React.FC<Props> = ({ pages, selectedPageIds, onSelect }) => {
  // Convert data structure like below so we can easily construct the jsx.
  //{
  //  group: 'root',
  //  children: [
  //    'general',
  //    {
  //      group: 'Dashboard',
  //      children: ['quickview']
  //    },
  //    {
  //      group: 'Management',
  //      children: ['overall', {
  //        group: 'Analytics',
  //        children: ['dau', 'mau']
  //      }]
  //    },
  //    'settings'
  //  ]
  //}
  const tree = useMemo<Partial>(
    function () {
      type Tree = {
        [key: string]: Partial;
      };
      const tree: Tree = {};
      pages.forEach(function (page) {
        let group: string;
        if (!page.group) {
          group = 'root';
        } else {
          group = `root/${page.group}`;
        }
        // Make an array of all groups from root. e.g. ['root', 'root/Management', 'root/Management/Analytics']
        const levels: string[] = [];
        group.split('/').forEach(function (s, idx) {
          if (idx === 0) {
            levels.push(s);
          } else {
            levels.push(`${levels[idx - 1]}/${s}`);
          }
        });
        levels.forEach(function (level, idx) {
          if (!tree[level]) {
            const ref = (tree[level] = {
              group: level.split('/')[idx],
              children: [],
            });
            if (idx !== 0) {
              tree[levels[idx - 1]].children.push(ref);
            }
          }
        });
        tree[group].children.push(page.id);
      });
      return tree['root'];
    },
    [pages]
  );

  return (
    <GroupOrPage
      list={tree.children}
      selectedPageIds={selectedPageIds}
      onSelect={onSelect}
    />
  );
};
export default _Pages;

const GroupOrPage: React.FC<{
  list: Partial['children'];
  selectedPageIds: Info['x-pages'][number]['id'][];
  onSelect: (pageId: Info['x-pages'][number]['id'], separate: boolean) => void;
}> = ({ list, selectedPageIds, onSelect }) => {
  return (
    <ul>
      {list.map(function (item, idx) {
        let content: JSX.Element;
        if (typeof item === 'string') {
          content = (
            <Page
              pageId={item}
              isSelected={selectedPageIds.includes(item)}
              onSelect={onSelect}
            />
          );
        } else {
          content = (
            <Group
              partial={item}
              selectedPageIds={selectedPageIds}
              onSelect={onSelect}
            />
          );
        }
        return <li key={idx}>{content}</li>;
      })}
    </ul>
  );
};

const Group: React.FC<{
  partial: Partial;
  selectedPageIds: Info['x-pages'][number]['id'][];
  onSelect: (pageId: Info['x-pages'][number]['id'], separate: boolean) => void;
}> = ({ partial, selectedPageIds, onSelect }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleClick = function () {
    setIsOpened(!isOpened);
  };
  return (
    <div>
      <p className="font-bold" onClick={handleClick}>
        {isOpened ? (
          <AiOutlineDown className="inline mr-1" />
        ) : (
          <AiOutlineRight className="inline mr-1" />
        )}
        <span>{partial.group}</span>
      </p>
      <div
        className={classnames('ml-2', {
          hidden: !isOpened,
        })}
      >
        <GroupOrPage
          list={partial.children}
          selectedPageIds={selectedPageIds}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

const Page: React.FC<{
  pageId: Info['x-pages'][number]['id'];
  isSelected: boolean;
  onSelect: (pageId: Info['x-pages'][number]['id'], separate: boolean) => void;
}> = ({ pageId, isSelected, onSelect }) => {
  const handleClick = function () {
    // TODO: Let users choose the option to open a page separately.
    onSelect(pageId, true);
  };
  return (
    <p
      className={classnames({
        underline: isSelected,
      })}
      onClick={handleClick}
    >
      {pageId}
    </p>
  );
};
