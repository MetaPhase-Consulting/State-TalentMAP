import querystring from 'query-string';
import { CancelToken } from 'axios';
import { get, isEqual } from 'lodash';
import { downloadFromResponse } from 'utilities';
import api from '../api';
import { toastError } from './toast';

let cancelRanking;

export function bidderRankingsHasErrored(bool) {
  return {
    type: 'BIDDER_RANKINGS_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function bidderRankingsIsLoading(bool, id) {
  return {
    type: 'BIDDER_RANKINGS_IS_LOADING',
    isLoading: { bool, id },
  };
}

export function bidderRankingFetchDataSuccess(id, data) {
  return {
    type: 'BIDDER_RANKING_FETCH_DATA_SUCCESS',
    results: { id, data },
  };
}

export function bureauPositionBidsHasErrored(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bureauPositionBidsIsLoading(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_IS_LOADING',
    isLoading: bool,
  };
}
export function bureauPositionBidsFetchDataSuccess(bids) {
  return {
    type: 'BUREAU_POSITION_BIDS_FETCH_DATA_SUCCESS',
    bids,
  };
}

export function bureauPositionBidsAllHasErrored(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_ALL_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bureauPositionBidsAllIsLoading(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_ALL_IS_LOADING',
    isLoading: bool,
  };
}
export function bureauPositionBidsAllFetchDataSuccess(bids) {
  return {
    type: 'BUREAU_POSITION_BIDS_ALL_FETCH_DATA_SUCCESS',
    bids,
  };
}

export function bureauPositionBidsRankingHasErrored(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_RANKING_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bureauPositionBidsRankingIsLoading(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_RANKING_IS_LOADING',
    isLoading: bool,
  };
}
export function bureauPositionBidsRankingFetchDataSuccess(bids) {
  return {
    type: 'BUREAU_POSITION_BIDS_RANKING_FETCH_DATA_SUCCESS',
    bids,
  };
}

export function bureauPositionBidsSetRankingHasErrored(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_SET_RANKING_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bureauPositionBidsSetRankingIsLoading(bool) {
  return {
    type: 'BUREAU_POSITION_BIDS_SET_RANKING_IS_LOADING',
    isLoading: bool,
  };
}
export function bureauPositionBidsSetRankingFetchDataSuccess(success) {
  return {
    type: 'BUREAU_POSITION_BIDS_SET_RANKING_FETCH_DATA_SUCCESS',
    success,
  };
}

export function bureauBidsFetchData(id, query = {}) {
  const q = querystring.stringify(query);
  return (dispatch) => {
    dispatch(bureauPositionBidsIsLoading(true));
    dispatch(bureauPositionBidsHasErrored(false));
    api()
      .get(`/fsbid/bureau/positions/${id}/bids/?${q}`)
      .then(({ data }) => data || [])
      .then((bids) => {
        dispatch(bureauPositionBidsFetchDataSuccess(bids));
        dispatch(bureauPositionBidsHasErrored(false));
        dispatch(bureauPositionBidsIsLoading(false));
      })
      .catch(() => {
        dispatch(bureauPositionBidsHasErrored(true));
        dispatch(bureauPositionBidsIsLoading(false));
      });
  };
}

export function bureauBidsAllFetchData(id, query) {
  let url = `/fsbid/bureau/positions/${id}/bids/`;
  const sort = query.ordering;
  if (sort) { url += `?ordering=${sort}`; }
  return (dispatch) => {
    dispatch(bureauPositionBidsAllIsLoading(true));
    dispatch(bureauPositionBidsAllHasErrored(false));
    api()
      .get(url)
      .then(({ data }) => data || [])
      .then((bids) => {
        dispatch(bureauPositionBidsAllFetchDataSuccess(bids));
        dispatch(bureauPositionBidsAllHasErrored(false));
        dispatch(bureauPositionBidsAllIsLoading(false));
      })
      .catch(() => {
        dispatch(bureauPositionBidsAllHasErrored(true));
        dispatch(bureauPositionBidsAllIsLoading(false));
      });
  };
}

export function bureauBidsSetRanking(id, ranking = []) {
  return (dispatch) => {
    if (cancelRanking) { cancelRanking('cancel'); }
    dispatch(bureauPositionBidsSetRankingIsLoading(true));
    dispatch(bureauPositionBidsSetRankingHasErrored(false));
    api()
      .delete(`/available_position/${id}/ranking/`, {
        cancelToken: new CancelToken((c) => {
          cancelRanking = c;
        }),
      })
      .then(() => {
        const prom = () => isEqual(ranking, []) ? Promise.resolve() :
          api()
            .post('/available_position/ranking/', ranking, {
              cancelToken: new CancelToken((c) => {
                cancelRanking = c;
              }),
            });

        prom()
          .then(() => {
            dispatch(bureauPositionBidsSetRankingFetchDataSuccess(true));
            dispatch(bureauPositionBidsSetRankingHasErrored(false));
            dispatch(bureauPositionBidsSetRankingIsLoading(false));
          })
          .catch(() => {
            dispatch(bureauPositionBidsSetRankingHasErrored(true));
            dispatch(bureauPositionBidsSetRankingIsLoading(false));
            dispatch(toastError('Your changes were not saved. Please try again.', 'An error has occurred'));
          });
      })
      .catch((err) => {
        dispatch(bureauPositionBidsSetRankingHasErrored(true));
        dispatch(bureauPositionBidsSetRankingIsLoading(false));
        if (get(err, 'response.status') === 403) {
          dispatch(toastError('This position has been locked by the bureau. Your changes were not saved.', 'Bureau position locked'));
        }
      });
  };
}

export function bureauBidsRankingFetchData(id) {
  return (dispatch) => {
    dispatch(bureauPositionBidsRankingIsLoading(true));
    dispatch(bureauPositionBidsRankingHasErrored(false));
    api()
      .get(`/available_position/ranking/?cp_id=${id}&page=1&limit=500`)
      .then(({ data }) => data.results || [])
      .then((bids) => {
        dispatch(bureauPositionBidsRankingFetchDataSuccess(bids));
        dispatch(bureauPositionBidsRankingHasErrored(false));
        dispatch(bureauPositionBidsRankingIsLoading(false));
      })
      .catch(() => {
        dispatch(bureauPositionBidsRankingHasErrored(true));
        dispatch(bureauPositionBidsRankingIsLoading(false));
      });
  };
}

export function downloadBidderData(id, query = {}) {
  const q = querystring.stringify(query);
  const url = `/fsbid/bureau/positions/${id}/bids/export/?${q}`;
  return api().get(url, {
    responseType: 'stream',
  })
    .then((response) => {
      downloadFromResponse(response, 'TalentMap_position_bids');
    })
    .catch(() => {
      // eslint-disable-next-line global-require
      require('../store').store.dispatch(toastError('Export unsuccessful. Please try again.', 'Error exporting'));
    });
}

export function fetchBidderRankings(perdet, cp_id) {
  const url = `/available_position/rankings/${perdet}/${cp_id}/`;
  return (dispatch) => {
    dispatch(bidderRankingsIsLoading(true, perdet));
    dispatch(bidderRankingsHasErrored(false));
    api().get(url)
      .then(({ data }) => {
        dispatch(bidderRankingFetchDataSuccess(perdet, data));
        dispatch(bidderRankingsHasErrored(false));
        dispatch(bidderRankingsIsLoading(false, perdet));
      })
      .catch(() => {
        dispatch(bidderRankingFetchDataSuccess(perdet, {}));
        dispatch(bidderRankingsHasErrored(true));
        dispatch(bidderRankingsIsLoading(false, perdet));
      });
  };
}
