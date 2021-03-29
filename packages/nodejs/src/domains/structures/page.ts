import { Section } from '../../constants';
import { Components } from './component';

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
