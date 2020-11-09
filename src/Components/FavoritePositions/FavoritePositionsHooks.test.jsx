/* import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, cleanup } from '@testing-library/react';
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { render, screen, fireEvent, debug } from '@testing-library/react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import FavoritePositions from './FavoritePositions';
import favoritesObject from '../../__mocks__/favoritesObject';
import bidListObject from '../../__mocks__/bidListObject';
// import sinon from 'sinon';
// import toJSON from 'enzyme-to-json';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const props = {
  favorites: favoritesObject.favorites,
  favoritesPV: favoritesObject.favoritesPV,
  favoritesTandem: favoritesObject.favoritesTandem,
  favoritesPVTandem: favoritesObject.favoritesPVTandem,
  favoritePositionsIsLoading: false,
  favoritePositionsHasErrored: false,
  bidList: bidListObject.results,
  onSortChange: () => {},
  sortType: '',
  page: 1,
  pageSize: 12,
  counts: favoritesObject.counts,
  onPageChange: () => {},
  selectedNav: () => {},
};
// eslint-disable-next-line no-unused-vars
const options = [
  { title: 'Open Positions ', value: 'open', numerator: props.counts.favorites },
  { title: 'Projected Vacancies ', value: 'pv', numerator: props.counts.favoritesPV },
  { title: 'Tandem Open Positions ', value: 'pvTandem', numerator: props.counts.favoritesTandem },
  { title: 'Tandem Projected Vacancies ', value: 'openTandem', numerator: props.counts.favoritesPVTandem },
];

test('just trying to render', () => {
/*  const wrapper = TestUtils.renderIntoDocument(<Provider store={mockStore({})}><MemoryRouter>
    <FavoritePositions {...props} />
  </MemoryRouter></Provider>);
  expect(wrapper).toBeDefined(); */


  /*
  const wrapper = mount(
    <FavoritePositions {...props} />,
  );
  expect(wrapper).toBeDefined(); */

  /* const wrapper = shallow(
    <FavoritePositions {...props} />,
  );
  expect(wrapper).toBeDefined(); */

  debug(props);
  debug(<FavoritePositions />);
  const what = render(<FavoritePositions {...props} />);
  debug(what);
  // expect(getByText(/Open/i).textContent).toBe('Open sdhsb');

  // render(<FavoritePositions {...props} />);
  // ReactDOM.render(<FavoritePositions {...props} />);
  // const present = screen.getByText(/something/i);
  // expect(present).toHaveTextContent(`Past:`);
});

// afterEach(cleanup);


// once it successfully renders, these tests should work
// 1. renders?
// render(<FavoritePositions {...props} />);

// 2. spinner shows when loading (on first load) and then is gone
// test('spinner initially shows', () => {
// should have an img with alt="center"
// should have an img with alt="middle"
// should have an img with alt="outer"
// i could only test for one of these, but if only 1 appears, our logo will look weird.
// so although a bit redundant, this tests that our logo is not only partially there
// once properly being used, find a way to export it so that it can be used in other tests.

// assert initial state
// the element isn't available yet, so wait for it:
// const spinnerCenter = await screen.getByAltText(/center/i)
// const spinnerMiddle = await screen.getByAltText(/middle/i)
// const spinnerOuter = await screen.getByAltText(/outer/i)
// expect(spinnerCenter).toBeInTheDocument();
// expect(spinnerMiddle).toBeInTheDocument();
// expect(spinnerOuter).toBeInTheDocument();


// the element is there but we want to wait for it to be removed
// await waitForElementToBeRemoved(() =>
//     screen.getByAltText(/center/i),
//     screen.getByAltText(/middle/i),
//     screen.getByAltText(/outer/i),
//     )
// expect(spinnerCenter).not.toBeInTheDocument();
// expect(spinnerMiddle).not.toBeInTheDocument();
// expect(spinnerOuter).not.toBeInTheDocument();
// });


// 3. if no favorites for tab and tab selected, show no favs text
// test('ap: no favs and current tab', () => {

// const noFavsAlert = screen.getByText(/you haven't added/i)
// const APTab = screen.getByText(/open positions/i)
// expect(APTab).toHaveTextContent(`0`)

// });


// 4. make sure that nav renders properly when the state is updated. this may
//      look like checking for the 'is-underlined' class in the Nav? Although
//      that seems like testing implementation
// 5. user only sees 2 tabs if they have no tandem favorites
// 7. when export button clicked downloadPositionData is called for proper data
// 8. counts are what they should be
