import { BiChevronDown } from '@react-icons/all-files/bi/BiChevronDown';
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight';
import { BiFolder } from '@react-icons/all-files/bi/BiFolder';
import { BiFolderOpen } from '@react-icons/all-files/bi/BiFolderOpen';
import classnames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Info } from '~/types/oas';

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
      pages={pages}
      depth={1}
      list={tree.children}
      selectedPageId={selectedPageId}
      onSelect={onSelect}
    />
  );
};
export default _Pages;

const GroupOrPage: React.FC<{
  pages: Info['x-pages'];
  depth: number;
  list: Partial['children'];
  selectedPageId: Info['x-pages'][number]['id'];
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ pages, depth, list, selectedPageId, onSelect }) => {
  return (
    <ul>
      {list.map(function (item, idx) {
        let content: JSX.Element;
        if (typeof item === 'string') {
          content = (
            <Page
              pages={pages}
              depth={depth}
              pageId={item}
              isSelected={item === selectedPageId}
              onSelect={onSelect}
            />
          );
        } else {
          content = (
            <Group
              pages={pages}
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
  pages: Info['x-pages'];
  depth: number;
  partial: Partial;
  selectedPageId: Info['x-pages'][number]['id'];
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ pages, depth, partial, selectedPageId, onSelect }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleClick = function () {
    setIsOpened(!isOpened);
  };
  return (
    <div>
      <button
        className="w-full text-left flex items-center gap-2 py-2 pr-2 text-xs text-on-surface hover:text-on-surface-high hover:bg-on-surface-faint focus:outline-none focus:ring-2 focus:ring-inset focus:ring-on-surface-high focus:text-on-surface-high focus:bg-on-surface-faint active:text-on-surface-high active:bg-on-surface-faint"
        style={{
          paddingLeft: `${depth * 8}px`,
        }}
        onClick={handleClick}
      >
        <div className="flex-0 flex items-center">
          {isOpened ? <BiFolderOpen /> : <BiFolder />}
        </div>
        <div className="flex-1 min-w-0">{partial.group}</div>
        <div className="flex-0 flex items-center">
          {isOpened ? <BiChevronDown /> : <BiChevronRight />}
        </div>
      </button>
      <div
        className={classnames({
          hidden: !isOpened,
        })}
      >
        <GroupOrPage
          pages={pages}
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
  pages: Info['x-pages'];
  depth: number;
  pageId: Info['x-pages'][number]['id'];
  isSelected: boolean;
  onSelect: (pageId: Info['x-pages'][number]['id']) => void;
}> = ({ pages, depth, pageId, isSelected, onSelect }) => {
  const handleClick = function () {
    onSelect(pageId);
  };
  const page = pages.find(function (page) {
    return page.id === pageId;
  });
  return (
    <button
      className={classnames(
        'block w-full text-left py-1 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-inset',
        {
          'text-on-surface hover:text-on-surface-high hover:bg-on-surface-faint focus:ring-on-surface-high focus:text-on-surface-high focus:bg-on-surface-faint active:text-on-surface-high active:bg-on-surface-faint':
            !isSelected,
          'font-bold text-on-primary bg-primary border-r-[4px] border-on-primary hover:bg-primary-variant hover:text-on-primary-variant hover:border-on-primary-variant focus:ring-primary-high active:bg-primary-variant active:text-on-primary-variant active:border-on-primary-variant':
            isSelected,
        }
      )}
      style={{
        paddingLeft: `${depth * 8}px`,
      }}
      onClick={handleClick}
    >
      {page?.title || pageId}
    </button>
  );
};
