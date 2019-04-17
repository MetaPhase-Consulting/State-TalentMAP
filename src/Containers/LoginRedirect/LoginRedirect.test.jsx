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

  it('is defined after calling componentDidMount()', () => {
    const wrapper = shallow(
      <LoginRedirect />,
    );
    wrapper.instance().componentDidMount();
    expect(wrapper).toBeDefined();
  });
});
