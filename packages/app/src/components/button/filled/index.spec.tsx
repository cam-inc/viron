import { render, screen } from '@testing-library/react';
import React from 'react';
import { COLOR_SYSTEM } from '~/types';
import Component from './index';

describe('FilledButton', () => {
  it('renders correctly', () => {
    const label = 'xxx';
    render(
      <Component
        cs={COLOR_SYSTEM.PRIMARY}
        label={label}
        onClick={() => {
          /* do nothing. */
        }}
      />
    );
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
