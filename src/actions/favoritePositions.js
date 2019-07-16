import { get } from 'lodash';
import api from '../api';
import { checkFlag } from '../flags';

const getUsePV = () => checkFlag('flags.projected_vacancy');

export function favoritePositionsHasErrored(bool) {
  return {
    type: 'FAVORITE_POSITIONS_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function favoritePositionsIsLoading(bool) {
  return {
    type: 'FAVORITE_POSITIONS_IS_LOADING',
    isLoading: bool,
  };
}

export function favoritePositionsFetchDataSuccess(results) {
  return {
    type: 'FAVORITE_POSITIONS_FETCH_DATA_SUCCESS',
    results,
  };
}

export function favoritePositionsFetchData(sortType) {
  const usePV = getUsePV();
  return (dispatch) => {
    dispatch(favoritePositionsIsLoading(true));
    dispatch(favoritePositionsHasErrored(false));
    const data$ = { favorites: [], favoritesPV: [] };
    let url = '/cycleposition/favorites/';
    let urlPV = '/projected_vacancy/favorites/';
    if (sortType) {
      const append = `?ordering=${sortType}`;
      url += append;
      urlPV += append;
    }

    const fetchFavorites = () =>
      api().get(url)
        .then(({ data }) => data)
        .catch(error => error);

    const fetchPVFavorites = () =>
      api().get(urlPV)
        .then(({ data }) => data)
        .catch(error => error);

    const queryProms = [fetchFavorites()];

    if (usePV) {
      queryProms.push(fetchPVFavorites());
    }

    Promise.all(queryProms)
    .then((results) => {
      // if any promise returned with errors, return the error
      let err;
      results.forEach((result) => {
        if (result instanceof Error) {
          err = result;
        }
      });
      if (err) {
        dispatch(favoritePositionsHasErrored(true));
        dispatch(favoritePositionsIsLoading(false));
      } else {
        // object 0 is favorites
        data$.favorites = get(results, '[0].results', []);
        data$.results = get(results, '[0].results', []);
        // object 1 is PV favorites
        // add PV property
        data$.favoritesPV = get(results, '[1].results', []).map(m => ({ ...m, isPV: true }));
        dispatch(favoritePositionsFetchDataSuccess(data$));
        dispatch(favoritePositionsHasErrored(false));
        dispatch(favoritePositionsIsLoading(false));
      }
    })
    .catch(() => {
      dispatch(favoritePositionsHasErrored(true));
      dispatch(favoritePositionsIsLoading(false));
    });
  };
}
