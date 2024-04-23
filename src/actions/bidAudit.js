import { CancelToken } from 'axios';
import {
  DELETE_BID_AUDIT_ERROR,
  DELETE_BID_AUDIT_ERROR_TITLE,
  DELETE_BID_AUDIT_SUCCESS,
  DELETE_BID_AUDIT_SUCCESS_TITLE,
  UPDATE_BID_AUDIT_ERROR,
  UPDATE_BID_AUDIT_ERROR_TITLE,
  UPDATE_BID_AUDIT_SUCCESS,
  UPDATE_BID_AUDIT_SUCCESS_TITLE,
  UPDATE_BID_COUNT_ERROR,
  UPDATE_BID_COUNT_ERROR_TITLE,
  UPDATE_BID_COUNT_SUCCESS,
  UPDATE_BID_COUNT_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { batch } from 'react-redux';
import api from '../api';
import { toastError, toastSuccess } from './toast';


// ================ Bid Audit: Get List ================

let cancelBidAuditFetch;

export function bidAuditFetchDataErrored(bool) {
  return {
    type: 'BID_AUDIT_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidAuditFetchDataLoading(bool) {
  return {
    type: 'BID_AUDIT_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function bidAuditFetchDataSuccess(results) {
  return {
    type: 'BID_AUDIT_FETCH_SUCCESS',
    results,
  };
}
export function bidAuditFetchData() {
  return (dispatch) => {
    if (cancelBidAuditFetch) {
      cancelBidAuditFetch('cancel');
    }
    batch(() => {
      dispatch(bidAuditFetchDataLoading(true));
      dispatch(bidAuditFetchDataErrored(false));
    });
    api().get('/fsbid/bid_audit/', {
      cancelToken: new CancelToken((c) => { cancelBidAuditFetch = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(bidAuditFetchDataSuccess(data));
          dispatch(bidAuditFetchDataErrored(false));
          dispatch(bidAuditFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(bidAuditFetchDataSuccess([]));
            dispatch(bidAuditFetchDataErrored(true));
            dispatch(bidAuditFetchDataLoading(false));
          });
        }
      });
  };
}


// ================ Bid Audit: Get In Category/At Grade ================

let cancelBidAuditSecondFetch;

export function bidAuditSecondFetchDataErrored(bool) {
  return {
    type: 'BID_AUDIT_SECOND_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidAuditSecondFetchDataLoading(bool) {
  return {
    type: 'BID_AUDIT_SECOND_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function bidAuditSecondFetchDataSuccess(results) {
  return {
    type: 'BID_AUDIT_SECOND_FETCH_SUCCESS',
    results,
  };
}
export function bidAuditSecondFetchData(cycleId, auditId, type) {
  return (dispatch) => {
    if (cancelBidAuditSecondFetch) {
      cancelBidAuditSecondFetch('cancel');
    }
    batch(() => {
      dispatch(bidAuditSecondFetchDataLoading(true));
      dispatch(bidAuditSecondFetchDataErrored(false));
    });
    api()
      .post(`/fsbid/bid_audit/${type}/`, {
        cycleId, auditId,
      }, {
        cancelToken: new CancelToken((c) => { cancelBidAuditSecondFetch = c; }),
      })
      .then(({ data }) => {
        batch(() => {
          dispatch(bidAuditSecondFetchDataSuccess(data));
          dispatch(bidAuditSecondFetchDataErrored(false));
          dispatch(bidAuditSecondFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(bidAuditSecondFetchDataSuccess([]));
            dispatch(bidAuditSecondFetchDataErrored(true));
            dispatch(bidAuditSecondFetchDataLoading(false));
          });
        }
      });
  };
}


// ----------------------------------------------------------------------
// ================ FUNCTIONS BELOW ARE CURRENTLY UNUSED ================
// ----------------------------------------------------------------------


// ================ Bid Audit: Get Audit ================

export function bidAuditErrored(bool) {
  return {
    type: 'BID_AUDIT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidAuditLoading(bool) {
  return {
    type: 'BID_AUDIT_EDIT_IS_LOADING',
    isLoading: bool,
  };
}
export function bidAuditSuccess(results) {
  return {
    type: 'BID_AUDIT_SUCCESS',
    results,
  };
}


// ================ Bid Audit: Delete ================

export function bidAuditDeleteLoading(bool) {
  return {
    type: 'BID_AUDIT_DELETE_IS_LOADING',
    isLoading: bool,
  };
}


// ================ TBD? ================

export function savebidAuditSelections(data) {
  return (dispatch) => {
    dispatch(bidAuditLoading(true));
    dispatch(bidAuditErrored(false));
    api().post('/Placeholder/', data)
      .then(({ res }) => {
        batch(() => {
          dispatch(bidAuditErrored(false));
          dispatch(bidAuditSuccess(res));
          dispatch(toastSuccess(UPDATE_BID_AUDIT_SUCCESS,
            UPDATE_BID_AUDIT_SUCCESS_TITLE));
          dispatch(bidAuditLoading(false));
        });
      }).catch(() => {
        batch(() => {
          dispatch(toastError(UPDATE_BID_AUDIT_ERROR,
            UPDATE_BID_AUDIT_ERROR_TITLE));
          dispatch(bidAuditErrored(true));
          dispatch(bidAuditLoading(false));
        });
      });
  };
}

// ================ Bid Audit: Delete ================

export function bidAuditDeleteDataErrored(bool) {
  return {
    type: 'BID_AUDIT_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function bidAuditDeleteDataSuccess(results) {
  return {
    type: 'BID_AUDIT_DELETE_SUCCESS',
    results,
  };
}
export function deleteBidAudit(id) {
  return (dispatch) => {
    dispatch(bidAuditDeleteLoading(true));
    api().delete(`/Placeholder/${id}/}`)
      .then(() => {
        dispatch(bidAuditDeleteLoading(false));
        dispatch(bidAuditDeleteDataErrored(false));
        dispatch(bidAuditDeleteDataSuccess('Successfully deleted the selected search.'));
        dispatch(toastSuccess(
          DELETE_BID_AUDIT_SUCCESS,
          DELETE_BID_AUDIT_SUCCESS_TITLE,
        ));
      })
      .catch(() => {
        dispatch(toastError(
          DELETE_BID_AUDIT_ERROR,
          DELETE_BID_AUDIT_ERROR_TITLE,
        ));
        dispatch(bidAuditDeleteLoading(false));
        dispatch(bidAuditDeleteDataSuccess(false));
      });
  };
}


// ================ Bid Audit: User Filter Selections ================

export function bidAuditSelectionsSaveSuccess(result) {
  return {
    type: 'BID_AUDIT_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}
export function saveBidAuditSelections(queryObject) {
  return (dispatch) => dispatch(bidAuditSelectionsSaveSuccess(queryObject));
}


// ================ Bid Audit: Filters ================

export function bidAuditFiltersFetchDataErrored(bool) {
  return {
    type: 'BID_AUDIT_FILTERS_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function bidAuditFiltersFetchDataLoading(bool) {
  return {
    type: 'BID_AUDIT_FILTERS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function bidAuditFiltersFetchDataSuccess(results) {
  return {
    type: 'BID_AUDIT_FILTERS_FETCH_SUCCESS',
    results,
  };
}
export function bidAuditFiltersFetchData() {
  return (dispatch) => {
    batch(() => {
      dispatch(bidAuditFiltersFetchDataSuccess({}));
      dispatch(bidAuditFiltersFetchDataLoading(false));
    });
  };
}


// ================ Bid Audit: Update Bid Counts ================

let cancelUpdateBidCounts;

export function bidAuditUpdateBidCounts() {
  return (dispatch) => {
    if (cancelUpdateBidCounts) {
      cancelUpdateBidCounts('cancel');
    }
    api()
      .get('/fsbid/bid_audit/update_count/', {
        cancelToken: new CancelToken((c) => { cancelUpdateBidCounts = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(UPDATE_BID_COUNT_SUCCESS,
            UPDATE_BID_COUNT_SUCCESS_TITLE));
        });
      },
      ).catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(
              toastError(
                UPDATE_BID_COUNT_ERROR,
                UPDATE_BID_COUNT_ERROR_TITLE,
              ),
            );
          });
        }
      });
  };
}
