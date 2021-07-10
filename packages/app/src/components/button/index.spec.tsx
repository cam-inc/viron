import { mount } from '@cypress/react';
import React from 'react';
import { ON } from '$constants/index';
import Button from './index';

it('Button', function () {
  mount(<Button on={ON.BACKGROUND} label="button" />);
  cy.get('button').contains('button').click();
});
