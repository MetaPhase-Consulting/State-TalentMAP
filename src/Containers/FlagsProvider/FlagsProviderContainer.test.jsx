import React from 'react';
import TestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { testDispatchFunctions } from '../../testUtilities/testUtilities';
import FlagsProviderContainer, { Flags, mapDispatchToProps } from './FlagsProviderContainer';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('FlagsProvider', () => {
  const props = {
    isAuthorized: () => true,
    fetchUserProfile: () => {},
  };

  it('renders', () => {
    const wrapper = TestUtils.renderIntoDocument(<Provider store={mockStore({})}><MemoryRouter>
      <FlagsProviderContainer {...props}>
        <div />
      </FlagsProviderContainer>
    </MemoryRouter></Provider>);
    expect(wrapper).toBeDefined();
  });

  it('is defined', () => {
    const wrapper = shallow(<Flags {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('maps flags when userProfile.id becomes truthy after a prop change', () => {
    const wrapper = shallow(<Flags {...props} />);
    const mapFlagsSpy = sinon.spy(wrapper.instance(), 'mapFlags');
    wrapper.setProps({ userProfile: { id: 1 } });
    sinon.assert.calledOnce(mapFlagsSpy);
  });

  it('does not map flags when userProfile.id does not become truthy after a prop change', () => {
    const wrapper = shallow(<Flags {...props} />);
    const mapFlagsSpy = sinon.spy(wrapper.instance(), 'mapFlags');
    wrapper.setProps({ userProfile: {} });
    sinon.assert.notCalled(mapFlagsSpy);
  });
});

describe('mapDispatchToProps', () => {
  const config = {
    fetchUserProfile: [],
  };
  testDispatchFunctions(mapDispatchToProps, config);
});
