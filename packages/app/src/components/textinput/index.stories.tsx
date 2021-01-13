import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react/types-6-0';
import Textinput from './index';

export default {
  title: 'Textinput',
  component: Textinput
};

const Template: Story<ComponentProps<typeof Textinput>> = (args) => (
  <Textinput {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  label: 'label',
  defaultValue: 'default value'
};
