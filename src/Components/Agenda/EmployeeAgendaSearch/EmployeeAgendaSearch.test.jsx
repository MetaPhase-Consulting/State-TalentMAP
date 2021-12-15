import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import toJSON from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EmployeeAgendaSearch from './EmployeeAgendaSearch';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('EmployeeAgendaSearchComponent', () => {
  it('is defined', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <EmployeeAgendaSearch isCDO />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot when CDO', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <EmployeeAgendaSearch isCDO />
        </MemoryRouter>
      </Provider>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when not CDO', () => {
    const wrapper = TestUtils.renderIntoDocument(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <EmployeeAgendaSearch isCDO={false} />
        </MemoryRouter>
      </Provider>,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
