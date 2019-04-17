import React from 'react';
import { shallow } from 'enzyme';
import Flags from './FlagsProvider';

describe('FlagsProvider', () => {
  const props = {
    children: <div />,
    flags: {},
  };

  it('is defined', () => {
    const wrapper = shallow(<Flags {...props} />);
    expect(wrapper).toBeDefined();
  });
});
