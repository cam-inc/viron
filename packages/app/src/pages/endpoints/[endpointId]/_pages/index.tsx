import React, { useMemo } from 'react';
import { Info } from '$types/oas';

type Partial = {
  group: string;
  children: (string | Partial)[];
};

type Props = {
  pages: Info['x-pages'];
};
const _Pages: React.FC<Props> = ({ pages }) => {
  // Convert data structure like below so we can easily construct the jsx.
  //const tree = {
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

  return <GroupOrPage list={tree.children} />;
};
export default _Pages;

const GroupOrPage: React.FC<{ list: Partial['children'] }> = ({ list }) => {
  return (
    <ul>
      {list.map(function (item, idx) {
        let content: JSX.Element;
        if (typeof item === 'string') {
          content = <Page pageId={item} />;
        } else {
          content = <Group partial={item} />;
        }
        return <li key={idx}>{content}</li>;
      })}
    </ul>
  );
};

const Group: React.FC<{ partial: Partial }> = ({ partial }) => {
  return (
    <div>
      <p className="font-bold">{partial.group}</p>
      <div className="ml-2">
        <GroupOrPage list={partial.children} />
      </div>
    </div>
  );
};

const Page: React.FC<{ pageId: Info['x-pages'][number]['id'] }> = ({
  pageId,
}) => {
  return <p>{pageId}</p>;
};
