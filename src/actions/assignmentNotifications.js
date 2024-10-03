import {
  GET_NOTIFICATION_ERROR,
  GET_NOTIFICATION_ERROR_TITLE,
  UPDATE_NOTIFICATION_ERROR,
  UPDATE_NOTIFICATION_ERROR_TITLE,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { CancelToken } from 'axios';
import { batch } from 'react-redux';
import api from '../api';
import { toastError, toastSuccess } from './toast';
import { convertQueryToString } from '../utilities';
import {
  GET_GAL_ERROR, GET_GAL_ERROR_TITLE, GET_MEMO_ERROR, GET_MEMO_ERROR_TITLE,
  REBUILD_MEMO_ERROR, REBUILD_MEMO_ERROR_TITLE, REBUILD_MEMO_SUCCESS, REBUILD_MEMO_SUCCESS_TITLE,
  REBUILD_NOTIFICATION_ERROR, REBUILD_NOTIFICATION_ERROR_TITLE,
  REBUILD_NOTIFICATION_SUCCESS, REBUILD_NOTIFICATION_SUCCESS_TITLE,
  SEND_MEMO_ERROR, SEND_MEMO_ERROR_TITLE, SEND_MEMO_SUCCESS, SEND_MEMO_SUCCESS_TITLE,
  SEND_NOTIFICATION_ERROR, SEND_NOTIFICATION_ERROR_TITLE,
  SEND_NOTIFICATION_SUCCESS, SEND_NOTIFICATION_SUCCESS_TITLE,
  UPDATE_MEMO_ERROR, UPDATE_MEMO_ERROR_TITLE, UPDATE_MEMO_SUCCESS, UPDATE_MEMO_SUCCESS_TITLE,
} from '../Constants/SystemMessages';
import { history } from '../store';


// ================ GET NOTE CABLE ================

export function noteCableFetchDataErrored(bool) {
  return {
    type: 'NOTE_CABLE_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function noteCableFetchDataLoading(bool) {
  return {
    type: 'NOTE_CABLE_FETCH_LOADING',
    isLoading: bool,
  };
}
export function noteCableFetchDataSuccess(results) {
  return {
    type: 'NOTE_CABLE_FETCH_SUCCESS',
    results,
  };
}
let cancelNoteCable;
export function noteCableFetchData(query = {}, location, memo) {
  return (dispatch) => {
    if (cancelNoteCable) { cancelNoteCable('cancel'); }
    batch(() => {
      dispatch(noteCableFetchDataLoading(true));
      dispatch(noteCableFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/notification/note_cable/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelNoteCable = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(noteCableFetchDataSuccess(data));
          dispatch(noteCableFetchDataErrored(false));
          dispatch(noteCableFetchDataLoading(false));
          history.push(`${location}/${memo ? 'memo' : 'notification'}/${data[0]?.NM_SEQ_NUM}`);
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(noteCableFetchDataSuccess({}));
            dispatch(noteCableFetchDataErrored(true));
            dispatch(noteCableFetchDataLoading(false));
            if (memo) {
              dispatch(toastError(
                GET_MEMO_ERROR,
                GET_MEMO_ERROR_TITLE,
              ));
            } else {
              dispatch(toastError(
                GET_NOTIFICATION_ERROR,
                GET_NOTIFICATION_ERROR_TITLE,
              ));
            }
          });
        } else {
          batch(() => {
            dispatch(noteCableFetchDataSuccess({}));
            dispatch(noteCableFetchDataErrored(false));
            dispatch(noteCableFetchDataLoading(true));
          });
        }
      });
  };
}

// ================ GET CABLE ================

export function cableFetchDataErrored(bool) {
  return {
    type: 'CABLE_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function cableFetchDataLoading(bool) {
  return {
    type: 'CABLE_FETCH_LOADING',
    isLoading: bool,
  };
}
export function cableFetchDataSuccess(results) {
  return {
    type: 'CABLE_FETCH_SUCCESS',
    results,
  };
}
let cancelCable;
export function cableFetchData(query = {}) {
  return (dispatch) => {
    if (cancelCable) { cancelCable('cancel'); }
    batch(() => {
      dispatch(cableFetchDataLoading(true));
      dispatch(cableFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/notification/cable/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelCable = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cableFetchDataSuccess(data));
          dispatch(cableFetchDataErrored(false));
          dispatch(cableFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cableFetchDataSuccess({}));
            dispatch(cableFetchDataErrored(false));
            dispatch(cableFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(cableFetchDataSuccess({}));
            dispatch(cableFetchDataErrored(true));
            dispatch(cableFetchDataLoading(false));
          });
        }
      });
  };
}

// ================ GET NOTE CABLE REF ================

export function noteCableRefFetchDataErrored(bool) {
  return {
    type: 'NOTE_CABLE_REF_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function noteCableRefFetchDataLoading(bool) {
  return {
    type: 'NOTE_CABLE_REF_FETCH_LOADING',
    isLoading: bool,
  };
}
export function noteCableRefFetchDataSuccess(results) {
  return {
    type: 'NOTE_CABLE_REF_FETCH_SUCCESS',
    results,
  };
}
let cancelNoteCableRef;
export function noteCableRefFetchData(query = {}) {
  return (dispatch) => {
    if (cancelNoteCableRef) { cancelNoteCableRef('cancel'); }
    batch(() => {
      dispatch(noteCableRefFetchDataLoading(true));
      dispatch(noteCableRefFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/notification/note_cable/ref/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelNoteCableRef = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(noteCableRefFetchDataSuccess(data));
          dispatch(noteCableRefFetchDataErrored(false));
          dispatch(noteCableRefFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(noteCableRefFetchDataSuccess({}));
            dispatch(noteCableRefFetchDataErrored(false));
            dispatch(noteCableRefFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(noteCableRefFetchDataSuccess({}));
            dispatch(noteCableRefFetchDataErrored(true));
            dispatch(noteCableRefFetchDataLoading(false));
          });
        }
      });
  };
}

// ================ EDIT NOTIFICATION/MEMO ================

let cancelEditNoteCable;
export function editNoteCable(data, onSuccess, memo) {
  return (dispatch) => {
    if (cancelEditNoteCable) {
      cancelEditNoteCable('cancel');
    }
    api()
      .post('/fsbid/notification/cable/edit/', data, {
        cancelToken: new CancelToken((c) => { cancelEditNoteCable = c; }),
      })
      .then(() => {
        if (memo) {
          dispatch(toastSuccess(
            UPDATE_MEMO_SUCCESS,
            UPDATE_MEMO_SUCCESS_TITLE,
          ));
        } else {
          dispatch(toastSuccess(
            UPDATE_NOTIFICATION_SUCCESS,
            UPDATE_NOTIFICATION_SUCCESS_TITLE,
          ));
        }
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          if (memo) {
            dispatch(toastSuccess(
              UPDATE_MEMO_ERROR,
              UPDATE_MEMO_ERROR_TITLE,
            ));
          } else {
            dispatch(toastError(
              UPDATE_NOTIFICATION_ERROR,
              UPDATE_NOTIFICATION_ERROR_TITLE,
            ));
          }
        }
      });
  };
}

// ================ REBUILD NOTIFICATION ================

let cancelRebuildNotification;
export function rebuildNotification(data, onSuccess, memo) {
  return (dispatch) => {
    if (cancelRebuildNotification) {
      cancelRebuildNotification('cancel');
    }
    api()
      .put('/fsbid/notification/rebuild/', data, {
        cancelToken: new CancelToken((c) => { cancelRebuildNotification = c; }),
      })
      .then(() => {
        if (memo) {
          dispatch(toastSuccess(
            REBUILD_MEMO_SUCCESS,
            REBUILD_MEMO_SUCCESS_TITLE,
          ));
        } else {
          dispatch(toastSuccess(
            REBUILD_NOTIFICATION_SUCCESS,
            REBUILD_NOTIFICATION_SUCCESS_TITLE,
          ));
        }
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          if (memo) {
            dispatch(toastError(
              REBUILD_MEMO_ERROR,
              REBUILD_MEMO_ERROR_TITLE,
            ));
          } else {
            dispatch(toastError(
              REBUILD_NOTIFICATION_ERROR,
              REBUILD_NOTIFICATION_ERROR_TITLE,
            ));
          }
        }
      });
  };
}

// ================ SEND NOTIFICATION/MEMO ================

let cancelSendNotification;
export function sendNotification(data, onSuccess, memo) {
  return (dispatch) => {
    if (cancelSendNotification) {
      cancelSendNotification('cancel');
    }
    api()
      .post('/fsbid/notification/send/', data, {
        cancelToken: new CancelToken((c) => { cancelSendNotification = c; }),
      })
      .then(() => {
        api()
          .post('/fsbid/notification/store/', data, {
            cancelToken: new CancelToken((c) => { cancelSendNotification = c; }),
          })
          .then(() => {
            if (memo) {
              dispatch(toastSuccess(
                SEND_MEMO_SUCCESS,
                SEND_MEMO_SUCCESS_TITLE,
              ));
            } else {
              dispatch(toastSuccess(
                SEND_NOTIFICATION_SUCCESS,
                SEND_NOTIFICATION_SUCCESS_TITLE,
              ));
            }
            if (onSuccess) {
              onSuccess();
            }
          })
          .catch((err) => {
            if (err?.message !== 'cancel') {
              if (memo) {
                dispatch(toastError(
                  SEND_MEMO_ERROR,
                  SEND_MEMO_ERROR_TITLE,
                ));
              } else {
                dispatch(toastError(
                  SEND_NOTIFICATION_ERROR,
                  SEND_NOTIFICATION_ERROR_TITLE,
                ));
              }
            }
          });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          if (memo) {
            dispatch(toastError(
              SEND_MEMO_ERROR,
              SEND_MEMO_ERROR_TITLE,
            ));
          } else {
            dispatch(toastError(
              SEND_NOTIFICATION_ERROR,
              SEND_NOTIFICATION_ERROR_TITLE,
            ));
          }
        }
      });
  };
}


// ================ GAL LOOKUP ================

export function getGalErrored(bool) {
  return {
    type: 'GAL_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function getGalLoading(bool) {
  return {
    type: 'GAL_FETCH_LOADING',
    isLoading: bool,
  };
}
export function getGalSuccess(results) {
  return {
    type: 'GAL_FETCH_SUCCESS',
    results,
  };
}
let cancelGetGal;
export function getGal(query = {}) {
  return (dispatch) => {
    if (cancelGetGal) { cancelGetGal('cancel'); }
    batch(() => {
      dispatch(getGalLoading(true));
      dispatch(getGalErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/notification/gal/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelGetGal = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(getGalSuccess(data));
          dispatch(getGalErrored(false));
          dispatch(getGalLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(getGalSuccess({}));
            dispatch(getGalErrored(true));
            dispatch(getGalLoading(false));
            dispatch(toastError(
              GET_GAL_ERROR,
              GET_GAL_ERROR_TITLE,
            ));
          });
        } else {
          batch(() => {
            dispatch(getGalSuccess({}));
            dispatch(getGalErrored(false));
            dispatch(getGalLoading(true));
          });
        }
      });
  };
}
