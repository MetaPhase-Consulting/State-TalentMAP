import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { testDispatchFunctions } from '../../../testUtilities/testUtilities';
import ResultsMultiSearchContainer, { mapDispatchToProps } from './ResultsMultiSearchContainer';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ResultsMultiSearchContainer', () => {
  const props = {
    onNavigateTo: () => {},
  };

  it('is defined', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider {...props} store={mockStore({})}><MemoryRouter>
        <ResultsMultiSearchContainer />
      </MemoryRouter></Provider>);
    expect(wrapper).toBeDefined();
  });

  it('can call the onFilterChange function', () => {
    const spy = sinon.spy();
    const wrapper = shallow(
      <ResultsMultiSearchContainer.WrappedComponent
        {...props}
        setSearchFilters={spy}
      />,
    );
    wrapper.instance().onFilterChange({});
    sinon.assert.calledOnce(spy);
  });

  it('can form a query with the onSubmit function', () => {
    const url = { value: '' };
    function navigateTo(value) { url.value = value; }
    const wrapper = shallow(
      <ResultsMultiSearchContainer.WrappedComponent
        {...props}
        onNavigateTo={navigateTo}
      />,
    );
    wrapper.instance().onSubmit({ q: 'german' });
    expect(url.value).toBe('/results?q=german');
  });
});

describe('mapDispatchToProps', () => {
  const config = {
    onNavigateTo: ['/test'],
    setSearchFilters: [{}],
  };
  testDispatchFunctions(mapDispatchToProps, config);
});
