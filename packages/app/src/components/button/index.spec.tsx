import { render, screen } from '@testing-library/react';
import React from 'react';
import { ON } from '$constants/index';
import Button from './index';

describe('Button', function () {
  it('renders correctly', function () {
    const label = 'lanel';
    render(<Button on={ON.BACKGROUND} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
