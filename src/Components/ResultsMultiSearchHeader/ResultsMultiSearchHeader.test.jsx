import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import toJSON from 'enzyme-to-json';
import ResultsMultiSearchHeader from './ResultsMultiSearchHeader';

describe('ResultsMultiSearchHeaderComponent', () => {
  let wrapper = null;

  const props = {
    onUpdate: () => {},
    onSubmit: () => {},
  };

  // for testing prop updates
  const updatedProps = {
    defaultFilters: {
      q: 'german',
    },
  };

  it('is defined', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    expect(wrapper).toBeDefined();
  });

  it('can receive props', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    expect(wrapper.instance().props.filters).toBe(props.filters);
  });

  it('can call the onUpdate function', () => {
    const spy = sinon.spy();
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
      onUpdate={spy}
    />);
    wrapper.instance().props.onUpdate();
    expect(spy.calledOnce).toBe(true);
  });

  it('can call the onChangeText function', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    wrapper.instance().onChangeText({ target: { value: 'test' } });
    expect(wrapper.instance().state.q).toBe('test');
  });

  it('can submit a search', () => {
    const spy = sinon.spy();
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
      onSubmit={spy}
    />);
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    sinon.assert.calledOnce(spy);
  });

  it('can call the submitSearch function', () => {
    const spy = sinon.spy();
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
      onSubmit={spy}
    />);
    wrapper.instance().submitSearch({ preventDefault: () => {} });
    expect(spy.calledOnce).toBe(true);
  });

  it('can setup default values when defaultFilters are provided', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    const instance = wrapper.instance();
    instance.setupDefaultValues(updatedProps);
    // values from defaultFilters should be used
    expect(instance.state.q).toBe(updatedProps.defaultFilters.q);
  });

  it('can perform actions upon componentWillReceiveProps', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    // define the instance
    const spy = sinon.spy(wrapper.instance(), 'componentWillReceiveProps');
    wrapper.update();
    wrapper.instance().componentWillReceiveProps(updatedProps);
    sinon.assert.calledOnce(spy);
  });

  it('can return formatted queries', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    const query = wrapper.instance().formatQuery();
    expect(query).toBeDefined();
  });

  it('can setup default values when no defaultFilters are provided', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    const instance = wrapper.instance();
    instance.setupDefaultValues(updatedProps);
    // values from userProfile should be used
    expect(instance.state.q).toBe(updatedProps.defaultFilters.q);
  });

  it('matches snapshot', () => {
    wrapper = shallow(<ResultsMultiSearchHeader
      {...props}
    />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
