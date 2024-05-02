import { get } from 'lodash';
import { CancelToken } from 'axios';
import { batch } from 'react-redux';
import { DELETE_AGENDA_ITEM_ERROR,
  DELETE_AGENDA_ITEM_ERROR_TITLE, DELETE_AGENDA_ITEM_SUCCESS,
  DELETE_AGENDA_ITEM_SUCCESS_TITLE,
  UPDATE_AGENDA_ITEM_ERROR,
  UPDATE_AGENDA_ITEM_ERROR_TITLE, UPDATE_AGENDA_ITEM_SUCCESS,
  UPDATE_AGENDA_ITEM_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { toastError, toastSuccess } from './toast';
import api from '../api';

let cancelFetchAI;
let cancelModifyAI;
let cancelRemoveAI;
let cancelValidateAI;

export function aiModifyHasErrored(bool) {
  return {
    type: 'AI_MODIFY_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function aiModifyIsLoading(bool) {
  return {
    type: 'AI_MODIFY_IS_LOADING',
    isLoading: bool,
  };
}
export function aiModifySuccess(data) {
  return {
    type: 'AI_MODIFY_SUCCESS',
    data,
  };
}

export function fetchAIHasErrored(bool) {
  return {
    type: 'FETCH_AI_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function fetchAIIsLoading(bool) {
  return {
    type: 'FETCH_AI_IS_LOADING',
    isLoading: bool,
  };
}
export function fetchAISuccess(data) {
  return {
    type: 'FETCH_AI_SUCCESS',
    data,
  };
}

export function fetchAI(id) {
  return (dispatch) => {
    if (cancelFetchAI) { cancelFetchAI('cancel'); }
    batch(() => {
      dispatch(fetchAIIsLoading(true));
      dispatch(fetchAISuccess({}));
      dispatch(fetchAIHasErrored(false));
    });
    api()
      .get(`/fsbid/agenda/agenda_items/${id}/`,
        {
          cancelToken: new CancelToken((c) => {
            cancelFetchAI = c;
          }),
        },
      )
      .then(({ data }) => {
        batch(() => {
          dispatch(fetchAIHasErrored(false));
          dispatch(fetchAISuccess(data));
          dispatch(fetchAIIsLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(fetchAIHasErrored(false));
            dispatch(fetchAIIsLoading(false));
          });
        } else {
          batch(() => {
            dispatch(fetchAIHasErrored(true));
            dispatch(fetchAIIsLoading(false));
          });
        }
      });
  };
}

export function resetCreateAI() {
  return (dispatch) => {
    batch(() => {
      dispatch(aiModifyHasErrored(false));
      dispatch(aiModifySuccess(false));
      dispatch(aiModifyIsLoading(false));
    });
  };
}

// Used for editing and creating agenda
export function modifyAgenda(panel, legs, personId, ef, refData) {
  return (dispatch) => {
    if (cancelModifyAI) { cancelModifyAI('cancel'); }
    batch(() => {
      dispatch(aiModifyIsLoading(true));
      dispatch(aiModifySuccess(false));
      dispatch(aiModifyHasErrored(false));
    });
    api()
      .post('/fsbid/agenda/agenda_item/', {
        ...ef,
        personId,
        ...panel,
        agendaLegs: legs,
        refData,
      }, {
        cancelToken: new CancelToken((c) => {
          cancelModifyAI = c;
        }),
      })
      .then(({ data }) => {
        batch(() => {
          dispatch(aiModifyHasErrored(false));
          dispatch(aiModifySuccess(data));
          dispatch(toastSuccess(UPDATE_AGENDA_ITEM_SUCCESS, UPDATE_AGENDA_ITEM_SUCCESS_TITLE));
          dispatch(aiModifyIsLoading(false));
          dispatch(fetchAI(data));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(aiModifyHasErrored(false));
            dispatch(aiModifyIsLoading(false));
          });
        } else {
          batch(() => {
            dispatch(toastError(UPDATE_AGENDA_ITEM_ERROR, UPDATE_AGENDA_ITEM_ERROR_TITLE));
            dispatch(aiModifyHasErrored(true));
            dispatch(aiModifyIsLoading(false));
          });
        }
      });
  };
}

export function aiRemoveHasErrored(bool) {
  return {
    type: 'AI_REMOVE_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function aiRemoveIsLoading(bool) {
  return {
    type: 'AI_REMOVE_IS_LOADING',
    isLoading: bool,
  };
}

export function aiRemoveSuccess(results) {
  return {
    type: 'AI_REMOVE_SUCCESS',
    results,
  };
}

export function removeAgenda(aiData) {
  const { aiseqnum, aiupdatedate } = aiData;
  // modifies the date to match the format in the db
  const aiupdate = aiupdatedate.replace('T', ' ').replace('Z', '').slice(0, -4);
  return (dispatch) => {
    if (cancelRemoveAI) { cancelRemoveAI('cancel'); }
    batch(() => {
      dispatch(aiRemoveIsLoading(true));
      dispatch(aiRemoveHasErrored(false));
    });
    api()
      .post('/fsbid/agenda/agenda_items/delete/', {
        aiseqnum,
        aiupdatedate: aiupdate,
      }, {
        cancelToken: new CancelToken((c) => {
          cancelRemoveAI = c;
        }),
      })
      .then(() => {
        batch(() => {
          dispatch(aiRemoveHasErrored(false));
          dispatch(aiRemoveSuccess('Successfully deleted the selected agenda.'));
          dispatch(toastSuccess(DELETE_AGENDA_ITEM_SUCCESS, DELETE_AGENDA_ITEM_SUCCESS_TITLE));
          dispatch(aiRemoveIsLoading(false));
          // used the built in back button
          window.history.back();
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          batch(() => {
            dispatch(aiRemoveIsLoading(true));
            dispatch(aiRemoveHasErrored(false));
          });
        } else {
          batch(() => {
            dispatch(aiRemoveHasErrored(true));
            dispatch(toastError(DELETE_AGENDA_ITEM_ERROR, DELETE_AGENDA_ITEM_ERROR_TITLE));
            dispatch(aiRemoveIsLoading(false));
            dispatch(aiRemoveSuccess(false));
          });
        }
      });
  };
}


export function validateAIHasErrored(bool) {
  return {
    type: 'VALIDATE_AI_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function validateAIIsLoading(bool) {
  return {
    type: 'VALIDATE_AI_IS_LOADING',
    isLoading: bool,
  };
}
export function validateAISuccess(data) {
  return {
    type: 'VALIDATE_AI_SUCCESS',
    data,
  };
}

export function validateAI(panel, legs, personId, ef) {
  return (dispatch) => {
    if (cancelValidateAI) { cancelValidateAI('cancel'); }
    batch(() => {
      dispatch(validateAIIsLoading(true));
      dispatch(validateAIHasErrored(false));
    });
    api()
      .post('/fsbid/agenda/agenda_item/validate/', {
        ...ef,
        personId,
        ...panel,
        agendaLegs: legs,
      }, {
        cancelToken: new CancelToken((c) => {
          cancelValidateAI = c;
        }),
      })
      .then(({ data }) => {
        batch(() => {
          dispatch(validateAISuccess(data || {}));
          dispatch(validateAIIsLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          dispatch(validateAIIsLoading(false));
        } else {
          batch(() => {
            dispatch(validateAIHasErrored(true));
            dispatch(validateAIIsLoading(false));
          });
        }
      });
  };
}

export function resetAIValidation() {
  // an alternative would be to do ' || readMode' at each line where we do the
  // validation check, this is cleaner
  const forcedAllValid = {
    status: {
      valid: true,
      errorMessage: '',
    },
    reportCategory: {
      valid: true,
      errorMessage: '',
    },
    panelDate: {
      valid: true,
      errorMessage: '',
    },
    allValid: true,
  };
  return (dispatch) => {
    dispatch(validateAISuccess(forcedAllValid));
  };
}

