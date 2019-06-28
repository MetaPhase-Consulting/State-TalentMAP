import { shallow } from 'enzyme';
import React from 'react';
import Featured from './Featured';

describe('FeaturedComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<Featured />);

    expect(wrapper).toBeDefined();
  });
});
