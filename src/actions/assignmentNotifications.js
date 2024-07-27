import {
  UPDATE_PROJECTED_VACANCY_ERROR,
  UPDATE_PROJECTED_VACANCY_ERROR_TITLE,
  UPDATE_PROJECTED_VACANCY_SUCCESS,
  UPDATE_PROJECTED_VACANCY_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { CancelToken } from 'axios';
import { batch } from 'react-redux';
import api from '../api';
import { toastError, toastSuccess } from './toast';
import { convertQueryToString } from '../utilities';


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
export function noteCableFetchData(query = {}) {
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
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(noteCableFetchDataSuccess({}));
            dispatch(noteCableFetchDataErrored(false));
            dispatch(noteCableFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(noteCableFetchDataSuccess({}));
            dispatch(noteCableFetchDataErrored(true));
            dispatch(noteCableFetchDataLoading(false));
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
export function cableFetchData() {
  return (dispatch) => {
    if (cancelCable) { cancelCable('cancel'); }
    batch(() => {
      dispatch(cableFetchDataLoading(true));
      dispatch(cableFetchDataErrored(false));
    });
    api().get('/fsbid/notification/cable/', {
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

// ================ EDIT PROJECTED VACANCY ================

let cancelProjectedVacancyEdit;
export function projectedVacancyEdit(data, onSuccess) {
  return (dispatch) => {
    if (cancelProjectedVacancyEdit) {
      cancelProjectedVacancyEdit('cancel');
    }
    api()
      .put('/fsbid/admin/projected_vacancies/edit/', data, {
        cancelToken: new CancelToken((c) => { cancelProjectedVacancyEdit = c; }),
      })
      .then(() => {
        dispatch(toastSuccess(
          UPDATE_PROJECTED_VACANCY_SUCCESS,
          UPDATE_PROJECTED_VACANCY_SUCCESS_TITLE,
        ));
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(
            UPDATE_PROJECTED_VACANCY_ERROR,
            UPDATE_PROJECTED_VACANCY_ERROR_TITLE,
          ));
        }
      });
  };
}
