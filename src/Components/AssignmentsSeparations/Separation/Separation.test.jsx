import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Separation from './Separation';
import resultsObject from '../../../__mocks__/resultsObject';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Separation', () => {
  const result = resultsObject.results[0];

  it('is defined', () => {
    const wrapper = shallow(
      <Provider store={mockStore({})}>
        <Separation data={result} />
      </Provider>,
    );
    expect(wrapper).toBeDefined();
  });
});
