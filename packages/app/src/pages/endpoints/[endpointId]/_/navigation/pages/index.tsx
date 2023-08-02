import classnames from 'classnames';
import React, { useMemo, useState } from 'react';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import FolderIcon from '~/components/icon/folder/outline';
import FolderOpenIcon from '~/components/icon/folderOpen/outline';
import { Page, PageId } from '~/types/oas';

type Partial = {
  group: string;
  children: (string | Partial)[];
};

export type Props = {
  pages: Page[];
  selectedPageId: PageId;
  onSelect: (pageId: PageId) => void;
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
  const tree = useMemo<Partial>(() => {
    type Tree = {
      [key: string]: Partial;
    };
    const tree: Tree = {};
    pages.forEach((page) => {
      let group: string;
      if (!page.group) {
        group = 'root';
      } else {
        group = `root/${page.group}`;
      }
      // Make an array of all groups from root. e.g. ['root', 'root/Management', 'root/Management/Analytics']
      const levels: string[] = [];
      group.split('/').forEach((s, idx) => {
        if (idx === 0) {
          levels.push(s);
        } else {
          levels.push(`${levels[idx - 1]}/${s}`);
        }
      });
      levels.forEach((level, idx) => {
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
  }, [pages]);

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
  pages: Page[];
  depth: number;
  list: Partial['children'];
  selectedPageId: PageId;
  onSelect: (pageId: PageId) => void;
}> = ({ pages, depth, list, selectedPageId, onSelect }) => {
  return (
    <ul>
      {list.map((item, idx) => {
        let content: JSX.Element;
        if (typeof item === 'string') {
          const page = pages.find((p) => p.id === item) as Page;
          content = (
            <_Page
              page={page}
              depth={depth}
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
        return (
          <li key={idx} className="mt-1">
            {content}
          </li>
        );
      })}
    </ul>
  );
};

const Group: React.FC<{
  pages: Page[];
  depth: number;
  partial: Partial;
  selectedPageId: PageId;
  onSelect: (pageId: PageId) => void;
}> = ({ pages, depth, partial, selectedPageId, onSelect }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  function handleClick() {
    setIsOpened((currVal) => !currVal);
  }

  return (
    <div>
      <button
        className="rounded text-start py-1.5 w-full text-thm-on-surface-low text-xs flex items-center justify-between gap-1 hover:bg-thm-on-surface-faint focus:ring-4 ring-thm-on-surface-low focus:outline-none"
        style={{ paddingInlineStart: `${depth * 8}px` }}
        onClick={handleClick}
      >
        {isOpened ? (
          <FolderOpenIcon className="w-[1.5em] h-[1.5em] flex-none" />
        ) : (
          <FolderIcon className="w-[1.5em] h-[1.5em] flex-none" />
        )}
        <span className="w-0 flex-1 truncate">{partial.group}</span>
        {isOpened ? (
          <ChevronDownIcon className="w-[1.5em] h-[1.5em] flex-none" />
        ) : (
          <ChevronRightIcon className="w-[1.5em] h-[1.5em] flex-none" />
        )}
      </button>
      <div
        className={classnames('mt-1', {
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

const _Page: React.FC<{
  page: Page;
  depth: number;
  isSelected: boolean;
  onSelect: (pageId: PageId) => void;
}> = ({ page, depth, isSelected, onSelect }) => {
  function handleClick() {
    onSelect(page.id);
  }

  return (
    <button
      className={classnames(
        'rounded text-start py-1.5 w-full text-xs focus:ring-4 ring-thm-on-surface-low focus:outline-none truncate',
        {
          'text-thm-on-surface-faint bg-thm-on-surface-low': isSelected,
          'text-thm-on-surface-low hover:bg-thm-on-surface-faint': !isSelected,
        }
      )}
      style={{ paddingInlineStart: `${depth * 8}px` }}
      onClick={handleClick}
    >
      {page.title}
    </button>
  );
};
