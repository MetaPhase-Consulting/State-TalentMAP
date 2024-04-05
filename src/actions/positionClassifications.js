import { batch } from 'react-redux';
import { CancelToken } from 'axios';
import {
  UPDATE_POSITION_CLASSIFICATION_ERROR,
  UPDATE_POSITION_CLASSIFICATION_ERROR_TITLE,
  UPDATE_POSITION_CLASSIFICATION_SUCCESS,
  UPDATE_POSITION_CLASSIFICATION_SUCCESS_TITLE,
} from '../Constants/SystemMessages';
import api from '../api';
import { toastError, toastSuccess } from './toast';

let cancelEdit;

export function positionClassificationsIsLoading(bool) {
  return {
    type: 'POSITION_CLASSIFICATIONS_IS_LOADING',
    isLoading: bool,
  };
}

export function positionClassificationsFetchDataSuccess(results) {
  return {
    type: 'POSITION_CLASSIFICATIONS_FETCH_DATA_SUCCESS',
    results,
  };
}

export function positionClassificationNumberCheck(id) {
  return {
    type: 'POSITION_CLASSIFICATIONS_NUMBER_CHECK',
    currentNumber: id,
  };
}

export function positionClassifications(id) {
  return (dispatch) => {
    batch(() => {
      dispatch(positionClassificationsIsLoading(true));
    });

    api().get(`/fsbid/position_classifications/${id}/`)
      .then(({ data }) => {
        batch(() => {
          dispatch(positionClassificationsIsLoading(false));
          dispatch(positionClassificationsFetchDataSuccess(data));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(positionClassificationsIsLoading(false));
        });
      });
  };
}

export function positionClassificationsEdit(query, data) {
  return (dispatch) => {
    if (cancelEdit) {
      cancelEdit('cancel');
    }
    api().put('/fsbid/position_classifications/edit/', data, {
      cancelToken: new CancelToken((c) => { cancelEdit = c; }),
    })
      .then(() => {
        const toastTitle = UPDATE_POSITION_CLASSIFICATION_SUCCESS_TITLE;
        const toastMessage = UPDATE_POSITION_CLASSIFICATION_SUCCESS;
        batch(() => {
          dispatch(toastSuccess(toastMessage, toastTitle));
          dispatch(positionClassifications(query));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          const toastTitle = UPDATE_POSITION_CLASSIFICATION_ERROR_TITLE;
          const toastMessage = UPDATE_POSITION_CLASSIFICATION_ERROR;
          dispatch(toastError(toastMessage, toastTitle));
        }
      });
  };
}
