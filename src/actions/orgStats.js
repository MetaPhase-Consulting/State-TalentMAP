import { batch } from 'react-redux';
import { CancelToken } from 'axios';
import { convertQueryToString } from 'utilities';
import api from '../api';

let cancelOrgStats;

const dummyOrgStat = {
  results: [{
    id: '2561',
    bureau: '(EUR) BUR OF EUROPEAN AFF AND EURASIAN AFFAIRS',
    bureau_code: '120000',
    bureau_short_desc: 'EUR',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    id: '2562',
    bureau: '(EUR) BUR OF EUROPEAN AFF AND EURASIAN AFFAIRS',
    bureau_code: '120000',
    bureau_short_desc: 'EUR',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    id: '2562',
    bureau: '(EUR) BUR OF EUROPEAN AFF AND EURASIAN AFFAIRS',
    bureau_code: '120000',
    bureau_short_desc: 'EUR',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    id: '2561',
    bureau: '(EUR) BUR OF EUROPEAN AFF AND EURASIAN AFFAIRS',
    bureau_code: '120000',
    bureau_short_desc: 'EUR',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    id: '2562',
    bureau: '(AF) BUREAU OF AFRICAN AFFAIRS',
    bureau_code: '130000',
    bureau_short_desc: 'AF',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    id: '2562',
    bureau: '(AF) BUREAU OF AFRICAN AFFAIRS',
    bureau_code: '130000',
    bureau_short_desc: 'AF',
    organization: '(A/LM/OPS/TTM) TRANSPORTATION & TRAVEL MANAGEMENT DIVISION',
    title: 'Now & Summer 2020',
    bidcycle: {
      id: 160,
      name: 'Details/Training 2019',
      cycle_start_date: null,
      cycle_deadline_date: null,
      cycle_end_date: null,
      active: null,
      handshake_allowed_date: null,
    },
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }],
  bureau_summary: [{
    bureau: '(EUR) BUR OF EUROPEAN AFF AND EURASIAN AFFAIRS',
    bureau_short_desc: 'EUR',
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }, {
    bureau: '(AF) BUREAU OF AFRICAN AFFAIRS',
    bureau_short_desc: 'AF',
    total_pos: 1,
    total_filled: 1,
    total_percent: 1,
    overseas_pos: 1,
    overseas_filled: 1,
    overseas_percent: 1,
    domestic_pos: 1,
    domestic_filled: 1,
    domestic_percent: 1,
  }],
};


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
      cancelToken: new CancelToken((c) => {
        cancelOrgStats = c;
      }),
    })
      .then(() => {
        batch(() => {
          dispatch(orgStatsFetchDataSuccess(dummyOrgStat));
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
