import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import { routerMiddleware } from 'react-router-redux';

import createSagaMiddleware from 'redux-saga';

import createHistory from 'history/createBrowserHistory';

import { enableBatching } from 'redux-batched-actions';

import rootReducer from './reducers';

import IndexSagas from './index-sagas';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sortPreferences'], // only persist sortPreferences reducer
};

// Setup the middleware to watch between the Reducers and the Actions
const sagaMiddleware = createSagaMiddleware();

const history = createHistory({ basename: process.env.PUBLIC_URL });

const middleware = routerMiddleware(history);

/* eslint-disable no-underscore-dangle */
// Enables the redux devtools extension only in development environment
const composeEnhancers = (
  process.env.NODE_ENV === 'development'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;
/* eslint-enable no-underscore-dangle */

const persistedReducer = persistReducer(persistConfig, rootReducer);

const batchedReducer = enableBatching(persistedReducer);

function configureStore(initialState) {
  return createStore(
    batchedReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunk, middleware, sagaMiddleware),
    ),
  );
}

const store = configureStore();

const persistor = persistStore(store);

// Begin our Index Saga
sagaMiddleware.run(IndexSagas);

export { store, persistor, history };
