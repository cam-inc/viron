import React, { useMemo } from 'react';
import { Info } from '$types/oas';

type Props = {
  pages: Info['x-pages'];
};
const _Pages: React.FC<Props> = ({ pages }) => {
  const tree = useMemo(
    function () {
      type Tree = {
        [key: string]: (string | string[])[];
      };
      const tree: Tree = {};
      pages.forEach(function (page) {
        let group: string;
        if (!page.group) {
          group = 'root';
        } else {
          group = `root/${page.group}`;
        }
        const split = group.split('/');
        const arr: string[] = [];
        split.forEach(function (s, idx) {
          if (idx === 0) {
            arr.push(s);
          } else {
            arr.push(`${arr[idx - 1]}/${s}`);
          }
        });
        arr.forEach(function (a, idx) {
          if (!tree[a]) {
            const ref = (tree[a] = []);
            if (idx !== 0) {
              tree[arr[idx - 1]].push(ref);
            }
          }
        });
        tree[group].push(page.id);
      });
      return tree['root'];
    },
    [pages]
  );

  return <div>{JSON.stringify(tree, null, 2)}</div>;
};
export default _Pages;

const Page: React.FC<{ page: Info['x-pages'][number] }> = ({ page }) => {
  return null;
};
