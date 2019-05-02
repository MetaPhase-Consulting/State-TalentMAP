import { get } from 'lodash';
import { batchActions } from 'redux-batched-actions';
import api from '../api';

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
export function bidderPortfolioIsLoadingInfinite(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_IS_LOADING_INFINITE',
    isLoading: bool,
  };
}
export function bidderPortfolioFetchDataSuccess(results, fromFullUrl) {
  return {
    type: 'BIDDER_PORTFOLIO_FETCH_DATA_SUCCESS',
    results,
    shouldMergeData: fromFullUrl,
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

export function bidderPortfolioCountsHasErrored(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_COUNTS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidderPortfolioCountsIsLoading(bool) {
  return {
    type: 'BIDDER_PORTFOLIO_COUNTS_IS_LOADING',
    isLoading: bool,
  };
}
export function bidderPortfolioCountsFetchDataSuccess(counts) {
  return {
    type: 'BIDDER_PORTFOLIO_COUNTS_FETCH_DATA_SUCCESS',
    counts,
  };
}

export function bidderPortfolioLastQuery(query, count) {
  return {
    type: 'SET_BIDDER_PORTFOLIO_LAST_QUERY',
    query,
    count,
  };
}

export function bidderPortfolioCountsFetchData() {
  return (dispatch) => {
    dispatch(bidderPortfolioCountsIsLoading(true));
    dispatch(bidderPortfolioCountsHasErrored(false));
    api().get('/client/statistics/')
      .then(({ data }) => {
        dispatch(bidderPortfolioCountsHasErrored(false));
        dispatch(bidderPortfolioCountsIsLoading(false));
        dispatch(bidderPortfolioCountsFetchDataSuccess(data));
      })
      .catch(() => {
        dispatch(bidderPortfolioCountsHasErrored(true));
        dispatch(bidderPortfolioCountsIsLoading(false));
      });
  };
}

export function bidderPortfolioFetchData(query = '', fullUrl = '') {
  return (dispatch) => {
    let q = `/client/?${query}`;
    const fromFullUrl = !!fullUrl;
    if (fullUrl) {
      dispatch(bidderPortfolioIsLoadingInfinite(true));
      q = fullUrl;
    }
    dispatch(bidderPortfolioIsLoading(true));
    dispatch(bidderPortfolioHasErrored(false));
    api().get(q)
      .then(({ data }) => {
        dispatch(bidderPortfolioLastQuery(query, data.count));
        dispatch(bidderPortfolioFetchDataSuccess(data, fromFullUrl));
        dispatch(bidderPortfolioHasErrored(false));

        dispatch(batchActions(
          [bidderPortfolioIsLoadingInfinite(false), bidderPortfolioIsLoading(false)],
        ));
      })
      .catch(() => {
        dispatch(bidderPortfolioHasErrored(true));

        dispatch(batchActions(
          [bidderPortfolioIsLoadingInfinite(false), bidderPortfolioIsLoading(false)],
        ));
      });
  };
}

export function bidderPortfolioFetchDataInfinite() {
  return (dispatch, getState) => {
    const state = getState();
    const next = get(state, 'bidderPortfolio.next');
    const isLoading = get(state, 'bidderPortfolioIsLoading') || get(state, 'bidderPortfolioIsLoadingInfinite');
    if (next && !isLoading) {
      dispatch(bidderPortfolioFetchData(null, next));
    }
  };
}

export function bidderPortfolioFetchDataFromLastQuery() {
  return (dispatch, getState) => {
    dispatch(lastBidderPortfolioIsLoading(true));
    dispatch(lastBidderPortfolioHasErrored(false));
    const q = getState().bidderPortfolioLastQuery;
    api().get(q)
      .then(({ data }) => {
        dispatch(lastBidderPortfolioFetchDataSuccess(data));
        dispatch(lastBidderPortfolioHasErrored(false));
        dispatch(lastBidderPortfolioIsLoading(false));
      })
      .catch(() => {
        dispatch(lastBidderPortfolioHasErrored(true));
        dispatch(lastBidderPortfolioIsLoading(false));
      });
  };
}
