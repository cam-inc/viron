import { ChevronRightIcon, FolderIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
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
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tree?.children?.map((item, index) => (
            <Tree
              pages={pages}
              key={index}
              item={item}
              onSelect={onSelect}
              selectedPageId={selectedPageId}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default _Pages;

const Tree: React.FC<{
  pages: Page[];
  item: string | Partial;
  onSelect: (pageId: PageId) => void;
  selectedPageId?: string;
}> = ({ pages, item, onSelect, selectedPageId }) => {
  const page = pages?.find((p) => p.id === item);

  if (typeof item === 'string') {
    return (
      <SidebarMenuButton
        className="data-[active=true]:bg-transparent"
        onClick={() => {
          page?.id && onSelect(page.id);
        }}
        isActive={selectedPageId === page?.id}
      >
        {item}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={true}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            {item.group}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0">
            {item.children.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                pages={pages}
                onSelect={onSelect}
                selectedPageId={selectedPageId}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
