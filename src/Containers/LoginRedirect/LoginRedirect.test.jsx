import { shallow } from 'enzyme';
import React from 'react';
import LoginRedirect from './LoginRedirect';

describe('LoginRedirect', () => {
  it('is defined', () => {
    const wrapper = shallow(
      <LoginRedirect />,
    );
    expect(wrapper).toBeDefined();
  });
});
