// TODO: あとで消す
import {
  ApiMethod,
  API_METHOD,
  Color,
  QueryType,
  Section,
  STYLE,
  Style,
  Theme,
} from '../constants';

export interface Viron {
  color: Color;
  theme: Theme;
  name: string;
  pages: Pages;
  thumbnail: string;
  tags: string[];
}

export const genViron = (
  color: Color,
  theme: Theme,
  name: string,
  pages: Pages,
  thumbnail: string,
  tags: string[]
): Viron => {
  return {
    color,
    theme,
    name,
    pages,
    thumbnail,
    tags,
  };
};

export interface Component {
  api: ComponentApi;
  name: string;
  style: Style;
  pagination: boolean;
  primary?: string;
  query?: ComponentQueries;
  table_labels?: string[];
  actions?: string[];
  sort?: string[];
  auto_refresh_sec?: number;
  preview?: ComponentPreview;
  options?: ComponentOptions;
}

export type Components = Component[];

export const genComponent = (
  api: ComponentApi,
  name: string,
  style: Style,
  primary?: string,
  pagination = false,
  query?: ComponentQueries,
  tableLabels?: string[],
  actions?: string[],
  sort?: string[],
  autoRefreshSec?: number,
  preview?: ComponentPreview,
  options?: ComponentOptions
): Component => {
  return {
    api,
    name,
    style,
    pagination: Boolean(pagination),
    ...(primary ? { primary } : {}),
    ...(query ? { query } : {}),
    ...(tableLabels ? { table_labels: tableLabels } : {}),
    ...(actions ? { actions } : {}),
    ...(sort ? { sort } : {}),
    ...(autoRefreshSec ? { auto_refresh_sec: autoRefreshSec } : {}),
    ...(preview ? { preview } : {}),
    ...(options ? { options } : {}),
  };
};

export const genNumberComponent = (
  api: ComponentApi,
  name: string
): Component => {
  return genComponent(api, name, STYLE.NUMBER);
};

export const genTableComponent = (
  api: ComponentApi,
  name: string,
  primary: string,
  pagination = true,
  query?: ComponentQueries,
  tableLabels?: string[],
  actions?: string[],
  sort?: string[],
  autoRefreshSec?: number,
  preview?: ComponentPreview,
  options?: ComponentOptions
): Component => {
  return genComponent(
    api,
    name,
    STYLE.TABLE,
    primary,
    pagination,
    query,
    tableLabels,
    actions,
    sort,
    autoRefreshSec,
    preview,
    options
  );
};

export const genExplorerComponent = (
  api: ComponentApi,
  name: string,
  primary: string,
  pagination = true
): Component => {
  return genComponent(api, name, STYLE.TABLE, primary, pagination);
};

export interface ComponentApi {
  method: ApiMethod;
  path: string;
}

export const genComponentApi = (
  method: ApiMethod,
  path: string
): ComponentApi => {
  return { method, path };
};

export interface ComponentOption {
  key: string;
  value: string;
}

export type ComponentOptions = ComponentOption[];

export const genComponentOption = (
  key: string,
  value: string
): ComponentOption => {
  return { key, value };
};

export interface ComponentQuery {
  key: string;
  type: QueryType;
}

export type ComponentQueries = ComponentQuery[];

export const genComponentQuery = (
  key: string,
  type: QueryType
): ComponentQuery => {
  return { key, type };
};

export interface ComponentPreview {
  path: string;
  method: ApiMethod;
  target: string;
}

export const genComponentPreview = (
  path: string,
  method = API_METHOD.GET,
  target = '_blank'
): ComponentPreview => {
  return { path, method, target };
};

export interface Page {
  id: string;
  group: string;
  name: string;
  section: Section;
  components: Components;
}

export type Pages = Page[];

export const genPage = (
  id: string,
  group: string,
  name: string,
  section: Section,
  components: Components
): Page => {
  return {
    id,
    group,
    name,
    section,
    components,
  };
};
