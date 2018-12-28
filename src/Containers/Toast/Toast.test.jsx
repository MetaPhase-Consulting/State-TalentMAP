import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Toast from './Toast';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ToastContainer', () => {
  it('is defined', () => {
    const wrapper = TestUtils.renderIntoDocument(<Provider store={mockStore({})}><MemoryRouter>
      <Toast toastData={{ type: 'success', message: 'Success!' }} />
    </MemoryRouter></Provider>);
    expect(wrapper).toBeDefined();
  });
});
