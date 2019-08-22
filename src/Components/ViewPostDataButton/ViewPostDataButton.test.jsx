import { shallow } from 'enzyme';
import React from 'react';
import toJSON from 'enzyme-to-json';
import ViewPostDataButton from './ViewPostDataButton';

describe('ViewPostDataButtonComponent', () => {
  const props = {
    url: 'https://google.com/1',
    type: 'post',
  };
  it('is defined', () => {
    const wrapper = shallow(
      <ViewPostDataButton {...props} />,
    );
    expect(wrapper).toBeDefined();
  });

  it('can take props', () => {
    const wrapper = shallow(
      <ViewPostDataButton {...props} />,
    );
    expect(wrapper.instance().props.url).toBe(props.url);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(
      <ViewPostDataButton {...props} />,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
