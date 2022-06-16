import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import TestUtils from 'react-dom/test-utils';
import AgendaItemMaintenancePane from './AgendaItemMaintenancePane';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('AgendaItemMaintenancePane Component', () => {
  it('is defined', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <AgendaItemMaintenancePane />
        </MemoryRouter>
      </Provider>);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <AgendaItemMaintenancePane />
        </MemoryRouter>
      </Provider>);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
