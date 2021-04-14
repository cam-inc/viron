import React, { ComponentProps } from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import Textinput from './index';

export default {
  title: 'COMPONENTS/Textinput',
  component: Textinput,
} as Meta;

const Template: Story<ComponentProps<typeof Textinput>> = (args) => (
  <Textinput {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  label: 'label',
  description: 'description',
};
