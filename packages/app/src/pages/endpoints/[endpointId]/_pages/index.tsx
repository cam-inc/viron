import { AiOutlineDown } from '@react-icons/all-files/ai/AiOutlineDown';
import { AiOutlineUp } from '@react-icons/all-files/ai/AiOutlineUp';
import classnames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Info } from '$types/oas';

type Partial = {
  group: string;
  children: (string | Partial)[];
};

export type Props = {
  pages: Info['x-pages'];
  selectedPageId: Info['x-pages'][number]['id'];
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
};
const _Pages: React.FC<Props> = ({ pages, selectedPageId, onSelect }) => {
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
      depth={1}
      list={tree.children}
      selectedPageId={selectedPageId}
      onSelect={onSelect}
    />
  );
};
export default _Pages;

const GroupOrPage: React.FC<{
  depth: number;
  list: Partial['children'];
  selectedPageId: Info['x-pages'][number]['id'];
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ depth, list, selectedPageId, onSelect }) => {
  return (
    <ul>
      {list.map(function (item, idx) {
        let content: JSX.Element;
        if (typeof item === 'string') {
          content = (
            <Page
              depth={depth}
              pageId={item}
              isSelected={item === selectedPageId}
              onSelect={onSelect}
            />
          );
        } else {
          content = (
            <Group
              depth={depth}
              partial={item}
              selectedPageId={selectedPageId}
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
  depth: number;
  partial: Partial;
  selectedPageId: Info['x-pages'][number]['id'];
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ depth, partial, selectedPageId, onSelect }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleClick = function () {
    setIsOpened(!isOpened);
  };
  return (
    <div>
      <div
        className="flex justify-center py-2 pr-2 text-xs text-on-surface"
        style={{
          paddingLeft: `${depth * 8}px`,
        }}
        onClick={handleClick}
      >
        <div className="flex-1 min-w-0">{partial.group}</div>
        <div className="flex-0 ml-2 flex items-center text-xxs">
          {isOpened ? <AiOutlineDown /> : <AiOutlineUp />}
        </div>
      </div>
      <div
        className={classnames({
          hidden: !isOpened,
        })}
      >
        <GroupOrPage
          depth={depth + 1}
          list={partial.children}
          selectedPageId={selectedPageId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

const Page: React.FC<{
  depth: number;
  pageId: Info['x-pages'][number]['id'];
  isSelected: boolean;
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ depth, pageId, isSelected, onSelect }) => {
  const handleClick = function () {
    onSelect(pageId);
  };
  return (
    <div
      className={classnames('py-1 pr-2 text-xs', {
        'text-on-surface': !isSelected,
        'font-bold text-primary bg-on-primary border-r-[4px] border-primary':
          isSelected,
      })}
      style={{
        paddingLeft: `${depth * 8}px`,
      }}
      onClick={handleClick}
    >
      {pageId}
    </div>
  );
};
