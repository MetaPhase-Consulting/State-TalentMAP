import { batch } from 'react-redux';
import { CancelToken } from 'axios';
import {
  UPDATE_PUBLISHABLE_POSITION_ERROR,
  UPDATE_PUBLISHABLE_POSITION_ERROR_TITLE,
  UPDATE_PUBLISHABLE_POSITION_SUCCESS,
  UPDATE_PUBLISHABLE_POSITION_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { convertQueryToString, downloadFromResponse, formatDate } from 'utilities';
import { toastError, toastSuccess } from './toast';
import api from '../api';

let cancelPPData;
let cancelPPedit;
let cancelPPfiltersData;

export function publishablePositionsErrored(bool) {
  return {
    type: 'PUBLISHABLE_POSITIONS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function publishablePositionsLoading(bool) {
  return {
    type: 'PUBLISHABLE_POSITIONS_IS_LOADING',
    isLoading: bool,
  };
}
export function publishablePositionsSuccess(results) {
  return {
    type: 'PUBLISHABLE_POSITIONS_SUCCESS',
    results,
  };
}
export function publishablePositionsFetchData(query = {}) {
  return (dispatch) => {
    if (cancelPPData) { cancelPPData('cancel'); }
    batch(() => {
      dispatch(publishablePositionsLoading(true));
      dispatch(publishablePositionsErrored(false));
    });
    const q = convertQueryToString(query);
    api().get(`/fsbid/publishable_positions/?${q}`, {
      cancelToken: new CancelToken((c) => { cancelPPData = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(publishablePositionsSuccess(data));
          dispatch(publishablePositionsErrored(false));
          dispatch(publishablePositionsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(publishablePositionsSuccess([]));
            dispatch(publishablePositionsErrored(true));
            dispatch(publishablePositionsLoading(false));
          });
        }
      });
  };
}


export function publishablePositionsEdit(query, data) {
  return (dispatch) => {
    if (cancelPPedit) {
      cancelPPedit('cancel');
    }
    api().post('/fsbid/publishable_positions/edit/', data, {
      cancelToken: new CancelToken((c) => { cancelPPedit = c; }),
    })
      .then(() => {
        const toastTitle = UPDATE_PUBLISHABLE_POSITION_SUCCESS_TITLE;
        const toastMessage = UPDATE_PUBLISHABLE_POSITION_SUCCESS;
        batch(() => {
          dispatch(toastSuccess(toastMessage, toastTitle));
          dispatch(publishablePositionsFetchData(query));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          const toastTitle = UPDATE_PUBLISHABLE_POSITION_ERROR_TITLE;
          const toastMessage = UPDATE_PUBLISHABLE_POSITION_ERROR;
          dispatch(toastError(toastMessage, toastTitle));
        }
      });
  };
}


export function publishablePositionsSelections(result) {
  return {
    type: 'PUBLISHABLE_POSITIONS_SELECTIONS_SUCCESS',
    result,
  };
}
export function savePublishablePositionsSelections(queryObject) {
  return (dispatch) => dispatch(publishablePositionsSelections(queryObject));
}


export function publishablePositionsFiltersErrored(bool) {
  return {
    type: 'PUBLISHABLE_POSITIONS_FILTERS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function publishablePositionsFiltersLoading(bool) {
  return {
    type: 'PUBLISHABLE_POSITIONS_FILTERS_IS_LOADING',
    isLoading: bool,
  };
}
export function publishablePositionsFiltersSuccess(results) {
  return {
    type: 'PUBLISHABLE_POSITIONS_FILTERS_SUCCESS',
    results,
  };
}
export function publishablePositionsFiltersFetchData() {
  return (dispatch) => {
    if (cancelPPfiltersData) { cancelPPfiltersData('cancel'); dispatch(publishablePositionsFiltersLoading(true)); }
    batch(() => {
      dispatch(publishablePositionsFiltersLoading(true));
      dispatch(publishablePositionsFiltersErrored(false));
    });
    api().get('/fsbid/publishable_positions/filters/', {
      cancelToken: new CancelToken((c) => { cancelPPfiltersData = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(publishablePositionsErrored(false));
          dispatch(publishablePositionsLoading(false));
          dispatch(publishablePositionsFiltersSuccess(data));
          dispatch(publishablePositionsFiltersErrored(false));
          dispatch(publishablePositionsFiltersLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          batch(() => {
            dispatch(publishablePositionsFiltersLoading(true));
            dispatch(publishablePositionsFiltersErrored(false));
          });
        } else {
          batch(() => {
            dispatch(publishablePositionsFiltersSuccess({}));
            dispatch(publishablePositionsFiltersErrored(true));
            dispatch(publishablePositionsFiltersLoading(false));
          });
        }
      });
  };
}

export function publishablePositionsExport(query = {}) {
  const endpoint = '/fsbid/publishable_positions/export/';
  const q = convertQueryToString(query);
  const ep = `${endpoint}?${q}`;
  return api()
    .get(ep)
    .then((response) => {
      // eslint-disable-next-line max-len
      downloadFromResponse(response, `Publishable_Positions_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}
