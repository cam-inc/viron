import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
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
    <SidebarGroup>
      <SidebarMenu>
        <GroupOrPage
          pages={pages}
          depth={0}
          list={tree.children}
          selectedPageId={selectedPageId}
          onSelect={onSelect}
        />
      </SidebarMenu>
    </SidebarGroup>
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
    <>
      {list.map((item, idx) => {
        let content: JSX.Element;
        if (typeof item === 'string') {
          const page = pages.find((p) => p.id === item) as Page;
          content = (
            <_Page
              page={page}
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

        return <SidebarMenuItem>{content}</SidebarMenuItem>;
      })}
    </>
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
  const handleClick = () => {
    setIsOpened((currVal) => !currVal);
  };
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger className="flex justify-between items-center w-full gap-2">
          {partial.group}
          {isOpened ? (
            <ChevronDown className="w-[1.25em] h-[1.25em] flex-none" />
          ) : (
            <ChevronRight className="w-[1.25em] h-[1.25em] flex-none" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0">
            <SidebarMenuSubItem>
              <GroupOrPage
                pages={pages}
                depth={depth + 1}
                list={partial.children}
                selectedPageId={selectedPageId}
                onSelect={onSelect}
              />
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const _Page: React.FC<{
  page: Page;
  isSelected: boolean;
  onSelect: (pageId: PageId) => void;
}> = ({ page, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(page.id);
  };

  return (
    <SidebarMenuButton isActive={isSelected} onClick={handleClick}>
      {page.title}
    </SidebarMenuButton>
  );
};
