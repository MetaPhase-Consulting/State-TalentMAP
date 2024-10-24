import { batch } from 'react-redux';
import { CancelToken } from 'axios';
import { convertQueryToString } from 'utilities';
import api from '../api';

let cancelOrgStats;
let cancelOSfiltersData;

export function orgStatsFetchDataErrored(bool) {
  return {
    type: 'ORG_STATS_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function orgStatsFetchDataLoading(bool) {
  return {
    type: 'ORG_STATS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function orgStatsFetchDataSuccess(results) {
  return {
    type: 'ORG_STATS_FETCH_SUCCESS',
    results,
  };
}

export function orgStatsFetchData(query = {}) {
  return (dispatch) => {
    if (cancelOrgStats) { cancelOrgStats('cancel'); dispatch(orgStatsFetchDataLoading(true)); }
    batch(() => {
      dispatch(orgStatsFetchDataLoading(true));
      dispatch(orgStatsFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    api().get(`/fsbid/org_stats/?${q}`, {
      cancelToken: new CancelToken((c) => { cancelOrgStats = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(orgStatsFetchDataSuccess(data));
          dispatch(orgStatsFetchDataErrored(false));
          dispatch(orgStatsFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          batch(() => {
            dispatch(orgStatsFetchDataLoading(true));
            dispatch(orgStatsFetchDataErrored(false));
          });
        } else {
          batch(() => {
            dispatch(orgStatsFetchDataSuccess([]));
            dispatch(orgStatsFetchDataErrored(true));
            dispatch(orgStatsFetchDataLoading(false));
          });
        }
      });
  };
}


export function orgStatsSelectionsSaveSuccess(result) {
  return {
    type: 'ORG_STATS_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}

export function saveOrgStatsSelections(queryObject) {
  return (dispatch) => dispatch(orgStatsSelectionsSaveSuccess(queryObject));
}

export function orgStatsFiltersErrored(bool) {
  return {
    type: 'ORG_STATS_FILTERS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function orgStatsFiltersLoading(bool) {
  return {
    type: 'ORG_STATS_FILTERS_IS_LOADING',
    isLoading: bool,
  };
}
export function orgStatsFiltersSuccess(results) {
  return {
    type: 'ORG_STATS_FILTERS_SUCCESS',
    results,
  };
}
export function orgStatsFiltersFetchData() {
  return (dispatch) => {
    if (cancelOSfiltersData) { cancelOSfiltersData('cancel'); dispatch(orgStatsFiltersLoading(true)); }
    batch(() => {
      dispatch(orgStatsFiltersLoading(true));
      dispatch(orgStatsFiltersErrored(false));
    });
    api().get('/fsbid/org_stats/filters/', {
      cancelToken: new CancelToken((c) => { cancelOSfiltersData = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(orgStatsFetchDataErrored(false));
          dispatch(orgStatsFetchDataLoading(false));
          dispatch(orgStatsFiltersSuccess(data));
          dispatch(orgStatsFiltersErrored(false));
          dispatch(orgStatsFiltersLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          batch(() => {
            dispatch(orgStatsFiltersLoading(true));
            dispatch(orgStatsFiltersErrored(false));
          });
        } else {
          batch(() => {
            dispatch(orgStatsFiltersSuccess({}));
            dispatch(orgStatsFiltersErrored(true));
            dispatch(orgStatsFiltersLoading(false));
          });
        }
      });
  };
}
