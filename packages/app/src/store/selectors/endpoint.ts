import { selector, selectorFamily } from 'recoil';
import {
  list as endpointListAtom,
  groupList as endpointGroupListAtom,
  NAME,
} from '~/store/atoms/endpoint';
import { Endpoint, EndpointGroup, EndpointGroupID, EndpointID } from '~/types';

const KEY = {
  LIST_BY_GROUP: 'listByGroup',
  LIST_UNGROUPED: 'listUngrouped',
  LIST_ITEM: 'listItem',
  GROUP_LIST_SORTED: 'groupListSorted',
  GROUP_LIST_ITEM: 'groupListItem',
} as const;

export const listByGroup = selector<
  {
    group: EndpointGroup;
    list: Endpoint[];
  }[]
>({
  key: `${NAME}.${KEY.LIST_BY_GROUP}`,
  get: ({ get }) => {
    const groupList = get(groupListSorted);
    const list = get(endpointListAtom);
    return groupList.map((group) => {
      return {
        group,
        list: list.filter((endpoint) => endpoint.groupId === group.id),
      };
    });
  },
});

// Return endpoints that match conditions:
// - No group specified.
// - Non-existed group specified.
export const listUngrouped = selector<Endpoint[]>({
  key: `${NAME}.${KEY.LIST_UNGROUPED}`,
  get: ({ get }) => {
    const list = get(endpointListAtom);
    const groupList = get(endpointGroupListAtom);
    return list.filter((item) => {
      if (!item.groupId) {
        return true;
      }
      if (!groupList.map((group) => group.id).includes(item.groupId)) {
        return true;
      }
      return false;
    });
  },
});

export const listItem = selectorFamily<Endpoint | null, { id: EndpointID }>({
  key: `${NAME}.${KEY.LIST_ITEM}`,
  get:
    ({ id }) =>
    ({ get }) => {
      const endpointList = get(endpointListAtom);
      return endpointList.find((endpoint) => endpoint.id === id) || null;
    },
  set:
    ({ id }) =>
    ({ set }, newValue) => {
      set(endpointListAtom, (currVal) => {
        return currVal.map((endpoint) => {
          if (endpoint.id !== id) {
            return endpoint;
          }
          return { ...endpoint, ...newValue };
        });
      });
    },
});

export const groupListSorted = selector<EndpointGroup[]>({
  key: `${NAME}.${KEY.GROUP_LIST_SORTED}`,
  get: ({ get }) => {
    const groupList = get(endpointGroupListAtom);
    return [...groupList].sort((a, b) => {
      return (b.priority || 0) - (a.priority || 0);
    });
  },
});

export const groupListItem = selectorFamily<
  EndpointGroup | null,
  { id: EndpointGroupID }
>({
  key: `${NAME}.${KEY.GROUP_LIST_ITEM}`,
  get:
    ({ id }) =>
    ({ get }) => {
      const groupList = get(endpointGroupListAtom);
      return groupList.find((group) => group.id === id) || null;
    },
  set:
    ({ id }) =>
    ({ set }, newValue) => {
      set(endpointGroupListAtom, (currVal) => {
        return currVal.map((group) => {
          if (group.id !== id) {
            return group;
          }
          return {
            ...group,
            ...newValue,
          };
        });
      });
    },
});
