import {
  CREATE_BIDDING_TOOL_ERROR,
  CREATE_BIDDING_TOOL_ERROR_TITLE,
  CREATE_BIDDING_TOOL_SUCCESS,
  CREATE_BIDDING_TOOL_SUCCESS_TITLE,
  DELETE_BIDDING_TOOL_ERROR,
  DELETE_BIDDING_TOOL_ERROR_TITLE,
  DELETE_BIDDING_TOOL_SUCCESS,
  DELETE_BIDDING_TOOL_SUCCESS_TITLE,
  EDIT_BIDDING_TOOL_ERROR,
  EDIT_BIDDING_TOOL_ERROR_TITLE,
  EDIT_BIDDING_TOOL_SUCCESS,
  EDIT_BIDDING_TOOL_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { CancelToken } from 'axios';
import { batch } from 'react-redux';
import api from '../api';
import { toastError, toastSuccess } from './toast';
import { history } from '../store';

let cancelBiddingTool;

// ================ BIDDING TOOL ================

export function biddingToolFetchDataErrored(bool) {
  return {
    type: 'BIDDING_TOOL_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function biddingToolFetchDataLoading(bool) {
  return {
    type: 'BIDDING_TOOL_FETCH_LOADING',
    isLoading: bool,
  };
}
export function biddingToolFetchDataSuccess(results) {
  return {
    type: 'BIDDING_TOOL_FETCH_SUCCESS',
    results,
  };
}
export function biddingTool(id) {
  return (dispatch) => {
    if (cancelBiddingTool) {
      cancelBiddingTool('cancel');
      dispatch(biddingToolFetchDataLoading(true));
    }
    batch(() => {
      dispatch(biddingToolFetchDataLoading(true));
      dispatch(biddingToolFetchDataErrored(false));
    });
    const ep = `/fsbid/bidding_tool/${id}/`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelBiddingTool = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(biddingToolFetchDataSuccess(data));
          dispatch(biddingToolFetchDataErrored(false));
          dispatch(biddingToolFetchDataLoading(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(biddingToolFetchDataErrored(true));
          dispatch(biddingToolFetchDataLoading(false));
        });
      });
  };
}


// ================ BIDDING TOOL LIST ================

export function biddingToolsFetchDataErrored(bool) {
  return {
    type: 'BIDDING_TOOLS_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function biddingToolsFetchDataLoading(bool) {
  return {
    type: 'BIDDING_TOOLS_FETCH_LOADING',
    isLoading: bool,
  };
}
export function biddingToolsFetchDataSuccess(results) {
  return {
    type: 'BIDDING_TOOLS_FETCH_SUCCESS',
    results,
  };
}
export function biddingTools() {
  return (dispatch) => {
    if (cancelBiddingTool) {
      cancelBiddingTool('cancel');
      dispatch(biddingToolsFetchDataLoading(true));
    }
    batch(() => {
      dispatch(biddingToolsFetchDataLoading(true));
      dispatch(biddingToolsFetchDataErrored(false));
    });
    const ep = '/fsbid/bidding_tool/';
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelBiddingTool = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(biddingToolsFetchDataErrored(false));
          dispatch(biddingToolsFetchDataSuccess(data));
          dispatch(biddingToolsFetchDataLoading(false));
        });
      })
      .catch(() => {
        dispatch(biddingToolsFetchDataErrored(true));
        dispatch(biddingToolsFetchDataLoading(false));
      });
  };
}

// ================ BIDDING TOOL DELETE ================

let cancelDelete;

export function biddingToolDelete(query, onSuccess) {
  return (dispatch) => {
    if (cancelDelete) {
      cancelDelete('cancel');
    }

    api().delete('/fsbid/bidding_tool/', query, {
      cancelToken: new CancelToken((c) => { cancelDelete = c; }),
    })
      .then(() => {
        dispatch(toastSuccess(DELETE_BIDDING_TOOL_SUCCESS, DELETE_BIDDING_TOOL_SUCCESS_TITLE));
        history.push('/profile/biddingtool');
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(DELETE_BIDDING_TOOL_ERROR, DELETE_BIDDING_TOOL_ERROR_TITLE));
        }
      });
  };
}

// ================ BIDDING TOOL EDIT ================

let cancelEdit;

export function biddingToolEdit(query, onSuccess) {
  return (dispatch) => {
    if (cancelEdit) {
      cancelEdit('cancel');
    }

    api().put('/fsbid/bidding_tool/', query, {
      cancelToken: new CancelToken((c) => { cancelEdit = c; }),
    })
      .then(() => {
        dispatch(toastSuccess(EDIT_BIDDING_TOOL_SUCCESS, EDIT_BIDDING_TOOL_SUCCESS_TITLE));
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(EDIT_BIDDING_TOOL_ERROR, EDIT_BIDDING_TOOL_ERROR_TITLE));
        }
      });
  };
}


// ================ BIDDING TOOL CREATE ================

let cancelCreate;

export function biddingToolCreate(query, onSuccess) {
  return (dispatch) => {
    if (cancelCreate) {
      cancelCreate('cancel');
    }

    api().post('/fsbid/bidding_tool/', query, {
      cancelToken: new CancelToken((c) => { cancelCreate = c; }),
    })
      .then((response) => {
        dispatch(toastSuccess(CREATE_BIDDING_TOOL_SUCCESS, CREATE_BIDDING_TOOL_SUCCESS_TITLE));
        history.push(`/profile/biddingtool/${response?.O_LOCATION_CODE}`);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(CREATE_BIDDING_TOOL_ERROR, CREATE_BIDDING_TOOL_ERROR_TITLE));
        }
      });
  };
}

export function biddingToolCreateDataErrored(bool) {
  return {
    type: 'BIDDING_TOOL_CREATE_DATA_ERRORED',
    hasErrored: bool,
  };
}
export function biddingToolCreateDataLoading(bool) {
  return {
    type: 'BIDDING_TOOL_CREATE_DATA_LOADING',
    isLoading: bool,
  };
}
export function biddingToolCreateDataSuccess(results) {
  return {
    type: 'BIDDING_TOOL_CREATE_DATA_SUCCESS',
    results,
  };
}
export function biddingToolCreateData() {
  return (dispatch) => {
    batch(() => {
      dispatch(biddingToolCreateDataLoading(true));
      dispatch(biddingToolCreateDataErrored(false));
    });
    api().get('/fsbid/bidding_tool/create/', {
      cancelToken: new CancelToken((c) => { cancelBiddingTool = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(biddingToolCreateDataErrored(false));
          dispatch(biddingToolCreateDataSuccess(data));
          dispatch(biddingToolCreateDataLoading(false));
        });
      })
      .catch(() => {
        dispatch(biddingToolCreateDataErrored(true));
        dispatch(biddingToolCreateDataLoading(false));
      });
  };
}
