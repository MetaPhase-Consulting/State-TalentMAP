import { batch } from 'react-redux';
import { stringify } from 'query-string';
import { find, get, includes, isArray, join, omit, replace } from 'lodash';
import { CancelToken } from 'axios';
import { toastSuccess } from 'actions/toast';
import { downloadFromResponse } from 'utilities';
import { BID_PORTFOLIO_SORTS } from 'Constants/Sort';
import { BIDDER_PORTFOLIO_ADD_ERROR, BIDDER_PORTFOLIO_ADD_SUCCESS } from '../Constants/SystemMessages';
import api from '../api';
import { toastError } from './toast';

let cancelCDOs;
let cancelPortfolio;
let cancelUnnassignedBidders;

export function bidderPortfolioSelectedSeasons(arr = []) {
  return {
    type: 'BIDDER_PORTFOLIO_SELECTED_SEASONS',
    data: arr,
  };
}
export function bidderPortfolioSeasonsHasErrored(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_SEASONS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidderPortfolioSeasonsIsLoading(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_SEASONS_IS_LOADING',
    isLoading: bool,
  };
}
export function bidderPortfolioSeasonsSuccess(results) {
  return {
    type: 'BIDDER_PORTFOLIO_SEASONS_SUCCESS',
    results,
  };
}

export function unassignedbidderTypeSuccess(results) {
  return {
    type: 'UNASSIGNED_BIDDER_TYPE_SUCCESS',
    results,
  };
}

export function bidderPortfolioSelectedUnassigned(arr = []) {
  return {
    type: 'BIDDER_PORTFOLIO_SELECTED_UNASSIGNED',
    data: arr,
  };
}

export function bidderPortfolioHasErrored(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidderPortfolioIsLoading(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_IS_LOADING',
    isLoading: bool,
  };
}
export function bidderPortfolioFetchDataSuccess(results) {
  return {
    type: 'BIDDER_PORTFOLIO_FETCH_DATA_SUCCESS',
    results,
  };
}

export function lastBidderPortfolioHasErrored(bool) {
  return {
    type: 'LAST_BIDDER_PORTFOLIO_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function lastBidderPortfolioIsLoading(bool) {
  return {
    type: 'LAST_BIDDER_PORTFOLIO_IS_LOADING',
    isLoading: bool,
  };
}
export function lastBidderPortfolioFetchDataSuccess(results) {
  return {
    type: 'LAST_BIDDER_PORTFOLIO_FETCH_DATA_SUCCESS',
    results,
  };
}

export function bidderPortfolioCDOsHasErrored(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_CDOS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidderPortfolioCDOsIsLoading(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_CDOS_IS_LOADING',
    isLoading: bool,
  };
}
export function bidderPortfolioCDOsFetchDataSuccess(data) {
  return {
    type: 'BIDDER_PORTFOLIO_CDOS_FETCH_DATA_SUCCESS',
    data,
  };
}

export function bidderPortfolioSelectCDO(data) {
  return {
    type: 'BIDDER_PORTFOLIO_SELECTED_CDO',
    data,
  };
}

export function bidderPortfolioSelectCDOsToSearchBy(data) {
  return {
    type: 'BIDDER_PORTFOLIO_SELECTED_CDOS_TO_SEARCH_BY',
    data,
  };
}

export function bidderPortfolioLastQuery(query, count) {
  return {
    type: 'SET_BIDDER_PORTFOLIO_LAST_QUERY',
    query,
    count,
  };
}
export function bidderPortfolioPaginationHasErrored(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_PAGINATION_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidderPortfolioPaginationIsLoading(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_PAGINATION_IS_LOADING',
    isLoading: bool,
  };
}
export function bidderPortfolioPaginationFetchDataSuccess(data) {
  return {
    type: 'BIDDER_PORTFOLIO_PAGINATION_FETCH_DATA_SUCCESS',
    data,
  };
}
export function saveBidderPortfolioPagination(paginationObject) {
  return (dispatch) => {
    dispatch(bidderPortfolioPaginationFetchDataSuccess(paginationObject));
  };
}

export function bidderPortfolioSetSeasons(seasons = []) {
  return (dispatch) => {
    dispatch(bidderPortfolioSelectedSeasons(seasons));
  };
}

export function bidderPortfolioSetUnassigned(UA = []) {
  return (dispatch) => {
    dispatch(bidderPortfolioSelectedUnassigned(UA));
  };
}

export function bidderPortfolioSeasonsFetchData() {
  return (dispatch) => {
    batch(() => {
      dispatch(bidderPortfolioSeasonsIsLoading(true));
      dispatch(bidderPortfolioSeasonsHasErrored(false));
    });
    const endpoint = '/fsbid/bid_seasons/';
    api().get(endpoint)
      .then(({ data }) => {
        batch(() => {
          dispatch(bidderPortfolioSeasonsSuccess(data));
          dispatch(bidderPortfolioSeasonsHasErrored(false));
          dispatch(bidderPortfolioSeasonsIsLoading(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(bidderPortfolioSeasonsSuccess([]));
          dispatch(bidderPortfolioSeasonsHasErrored(true));
          dispatch(bidderPortfolioSeasonsIsLoading(false));
        });
      });
  };
}

export function lookupAndSetCDO(id) {
  return (dispatch, getState) => {
    const cdo = find(get(getState(), 'bidderPortfolioCDOs', []), f => f.hru_id === id);
    if (cdo) {
      dispatch(bidderPortfolioSelectCDO(cdo));
    }
  };
}

export function getUnassignedBidderTypes(query = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const cdos = get(state, 'bidderPortfolioSelectedCDOsToSearchBy', []);
    const ids = cdos.map(m => m.hru_id).filter(f => f);
    const seasons = get(state, 'bidderPortfolioSelectedSeasons', []);
    const unassigned = get(state, 'bidderPortfolioSelectedUnassigned', []);
    let query$ = { ...query };
    if (ids.length) {
      query$.hru_id__in = ids.join();
    }
    if (isArray(seasons) && seasons.length) {
      query$.bid_seasons = join(seasons, ',');
    }
    if (!query$.bid_seasons || !query$.bid_seasons.length) {
      query$ = omit(query$, ['hasHandshake']); // hasHandshake requires at least one bid season
    }
    if (get(query, 'hasHandshake') === 'unassigned_filters') {
      query$ = omit(query$, ['hasHandshake']);
      const UAvalues = unassigned.map(a => a.value);
      if (includes(UAvalues, 'noHandshake')) {
        query$.hasHandshake = false;
      }
    }

    const query$$ = stringify(query$);
    const endpoint = '/fsbid/client/unassigned/';
    const q = `${endpoint}?${query$$}`;
    if (cancelUnnassignedBidders) {
      cancelUnnassignedBidders('cancel');
    }
    if (ids.length) {
      api().post(q, {
        cancelToken: new CancelToken((c) => { cancelUnnassignedBidders = c; }),
      })
        .then(({ data }) => {
          const tempData = data;
          batch(() => {
            if (tempData.length === 0) {
              dispatch(bidderPortfolioFetchDataSuccess([]));
            } else {
              dispatch(bidderPortfolioFetchDataSuccess(tempData));
            }
            dispatch(unassignedbidderTypeSuccess(tempData));
            const newQuery = { ...query$, perdet_seq_num: tempData.toString() };
            const query$$$ = stringify(newQuery);
            const secondEndpoint = '/fsbid/client/';
            const url = `${secondEndpoint}?${query$$$}`;
            api().get(url, {
              cancelToken: new CancelToken((c) => {
                cancelPortfolio = c;
              }),
            })
              .then(({ secondData }) => {
                batch(() => {
                  dispatch(bidderPortfolioLastQuery(query$$$, secondData.count, secondEndpoint));
                  dispatch(bidderPortfolioFetchDataSuccess(secondData));
                  dispatch(bidderPortfolioHasErrored(false));
                  dispatch(bidderPortfolioIsLoading(false));
                });
              })
              .catch((m) => {
                if (get(m, 'message') === 'cancel') {
                  batch(() => {
                    dispatch(bidderPortfolioHasErrored(false));
                    dispatch(bidderPortfolioIsLoading(true));
                  });
                } else {
                  batch(() => {
                    dispatch(bidderPortfolioHasErrored(true));
                    dispatch(bidderPortfolioIsLoading(false));
                  });
                }
              });
          });
        });
    }
  };
}


export function bidderPortfolioFetchData(query = {}) {
  return (dispatch, getState) => {
    if (cancelPortfolio) { cancelPortfolio('cancel'); }
    dispatch(bidderPortfolioIsLoading(true));
    dispatch(bidderPortfolioHasErrored(false));
    const state = getState();
    const cdos = get(state, 'bidderPortfolioSelectedCDOsToSearchBy', []);
    const ids = cdos.map(m => m.hru_id).filter(f => f);
    const seasons = get(state, 'bidderPortfolioSelectedSeasons', []);
    const unassigned = get(state, 'bidderPortfolioSelectedUnassigned', []);
    let query$ = { ...query };
    if (ids.length) {
      query$.hru_id__in = ids.join();
    }
    if (isArray(seasons) && seasons.length) {
      query$.bid_seasons = join(seasons, ',');
    }
    if (!query$.bid_seasons || !query$.bid_seasons.length) {
      query$ = omit(query$, ['hasHandshake']); // hasHandshake requires at least one bid season
    }
    if (get(query, 'hasHandshake') === 'unassigned_filters') {
      query$ = omit(query$, ['hasHandshake']);
      const UAvalues = unassigned.map(a => a.value);
      if (includes(UAvalues, 'noHandshake')) {
        query$.hasHandshake = false;
      }
    }

    // hasHandshake is a special case where we need to change the query to match the API for cusp_bidders
    if (get(query, 'hasHandshake') === 'cusp_bidders') {
      query$ = omit(query$, ['hasHandshake']);
      query$.cusp_bidder = true;
    }

    // hasHandshake is a special case where we need to change the query to match the API for eligible_bidders
    if (get(query, 'hasHandshake') === 'eligible_bidders') {
      query$ = omit(query$, ['hasHandshake']);
      query$.eligible_bidder = true;
    }

    if (!query$.ordering) {
      query$.ordering = BID_PORTFOLIO_SORTS.defaultSort;
    }
    const query$$ = stringify(query$);
    const endpoint = '/fsbid/client/';
    const q = `${endpoint}?${query$$}`;
    if (ids.length) {
      api().get(q, {
        cancelToken: new CancelToken((c) => {
          cancelPortfolio = c;
        }),
      })
        .then(({ data }) => {
          batch(() => {
            dispatch(bidderPortfolioLastQuery(query$$, data.count, endpoint));
            dispatch(bidderPortfolioFetchDataSuccess(data));
            dispatch(bidderPortfolioHasErrored(false));
            dispatch(bidderPortfolioIsLoading(false));
          });
        })
        .catch((m) => {
          if (get(m, 'message') === 'cancel') {
            batch(() => {
              dispatch(bidderPortfolioHasErrored(false));
              dispatch(bidderPortfolioIsLoading(true));
            });
          } else {
            batch(() => {
              dispatch(bidderPortfolioHasErrored(true));
              dispatch(bidderPortfolioIsLoading(false));
            });
          }
        });
    }
  };
}

// pass in a normal client endpoint and add export path
export function downloadClientData(q = '') {
  const q$ = replace(q, '/client/', '/client/export/');
  return api()
    .get(q$)
    .then((response) => {
      downloadFromResponse(response, 'TalentMap_client_export');
    });
}

export function bidderPortfolioCDOsFetchData() {
  return (dispatch, getState) => {
    if (cancelCDOs) { cancelCDOs('cancel'); }
    const cdos = get(getState(), 'bidderPortfolioCDOs', []);
    if (!cdos.length) {
      dispatch(bidderPortfolioCDOsIsLoading(true));
      dispatch(bidderPortfolioCDOsHasErrored(false));
      api().get('/fsbid/cdo/', {
        cancelToken: new CancelToken((c) => {
          cancelCDOs = c;
        }),
      })
        .then((result) => {
          const data = get(result, 'data', []).map(m => ({
            ...m,
            hru_id: m.hru_id || m.id,
            first_name: m.name,
            last_name: '',
          }));
          dispatch(bidderPortfolioCDOsFetchDataSuccess(data));
          if (!getState().bidderPortfolioSelectedCDOsToSearchBy.length) {
            const currentUser = data.find(f => f.isCurrentUser);
            if (currentUser) {
              batch(() => {
                dispatch(bidderPortfolioSelectCDOsToSearchBy([currentUser]));
                dispatch(bidderPortfolioSelectCDO(currentUser));
              });
            }
          }
          batch(() => {
            dispatch(bidderPortfolioCDOsHasErrored(false));
            dispatch(bidderPortfolioCDOsIsLoading(false));
          });
        })
        .catch(() => {
          batch(() => {
            dispatch(bidderPortfolioCDOsHasErrored(true));
            dispatch(bidderPortfolioCDOsIsLoading(false));
          });
        });
    }
  };
}

export function bidderPortfolioFetchDataFromLastQuery() {
  return (dispatch, getState) => {
    batch(() => {
      dispatch(lastBidderPortfolioIsLoading(true));
      dispatch(lastBidderPortfolioHasErrored(false));
    });
    const q = getState().bidderPortfolioLastQuery;
    api().get(q)
      .then(({ data }) => {
        const data$ = isArray(data) ? data : [];
        const data$$ = {
          results: data$,
          count: data$.length,
        };
        batch(() => {
          dispatch(bidderPortfolioFetchDataSuccess(data$$));
          dispatch(lastBidderPortfolioHasErrored(false));
          dispatch(lastBidderPortfolioIsLoading(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(lastBidderPortfolioHasErrored(true));
          dispatch(lastBidderPortfolioIsLoading(false));
        });
      });
  };
}

export function bidderPortfolioSelectionsSaveSuccess(result) {
  return {
    type: 'BIDDER_PORTFOLIO_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}

export function bidderPortfolioSelections(queryObject) {
  return (dispatch) => dispatch(bidderPortfolioSelectionsSaveSuccess(queryObject));
}

export function saveBidderPortfolioSelections(client) {
  return (dispatch) => {
    dispatch(bidderPortfolioSeasonsIsLoading(true));
    dispatch(bidderPortfolioSeasonsHasErrored(false));
    api()
      .post('/fsbid/client/', client)
      .then(({ data }) => {
        batch(() => {
          dispatch(bidderPortfolioSeasonsHasErrored(false));
          dispatch(bidderPortfolioSeasonsSuccess(data));
          dispatch(toastSuccess(BIDDER_PORTFOLIO_ADD_SUCCESS));
          dispatch(bidderPortfolioIsLoading(false));
        });
      })
      .catch(() => {
        dispatch(toastError(BIDDER_PORTFOLIO_ADD_ERROR));
        dispatch(bidderPortfolioSeasonsHasErrored(true));
        dispatch(bidderPortfolioIsLoading(false));
      });
  };
}

