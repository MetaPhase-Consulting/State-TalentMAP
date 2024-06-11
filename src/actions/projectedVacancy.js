import {
  UPDATE_PROJECTED_VACANCY_ERROR,
  UPDATE_PROJECTED_VACANCY_ERROR_TITLE,
  UPDATE_PROJECTED_VACANCY_SUCCESS,
  UPDATE_PROJECTED_VACANCY_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import { CancelToken } from 'axios';
import { batch } from 'react-redux';
import { get } from 'lodash';
import api from '../api';
import { toastError, toastSuccess } from './toast';
import { convertQueryToString } from '../utilities';

let cancelPVList;
let cancelPVLangOffsetOptions;
let cancelPVFilters;
let cancelPVLangOffsets;

// ================ GET LIST ================

export function projectedVacancyFetchDataErrored(bool) {
  return {
    type: 'PROJECTED_VACANCY_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function projectedVacancyFetchDataLoading(bool) {
  return {
    type: 'PROJECTED_VACANCY_FETCH_LOADING',
    isLoading: bool,
  };
}
export function projectedVacancyFetchDataSuccess(results) {
  return {
    type: 'PROJECTED_VACANCY_FETCH_SUCCESS',
    results,
  };
}
export function projectedVacancyFetchData(query = {}) {
  return (dispatch) => {
    if (cancelPVList) { cancelPVList('cancel'); }
    batch(() => {
      dispatch(projectedVacancyFetchDataLoading(true));
      dispatch(projectedVacancyFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/admin/projected_vacancies/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelPVList = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(projectedVacancyFetchDataSuccess(data));
          dispatch(projectedVacancyFetchDataErrored(false));
          dispatch(projectedVacancyFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(projectedVacancyFetchDataErrored(false));
            dispatch(projectedVacancyFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(projectedVacancyFetchDataErrored(true));
            dispatch(projectedVacancyFetchDataLoading(false));
          });
        }
      });
  };
}

// ================ EDIT FILTER SELECTIONS ================

export function projectedVacancySelectionsSaveSuccess(result) {
  return {
    type: 'PROJECTED_VACANCY_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}
export function saveProjectedVacancySelections(queryObject) {
  return (dispatch) => dispatch(projectedVacancySelectionsSaveSuccess(queryObject));
}

// ================ GET FILTER DATA ================

export function projectedVacancyFiltersErrored(bool) {
  return {
    type: 'PROJECTED_VACANCY_FILTERS_ERRORED',
    hasErrored: bool,
  };
}
export function projectedVacancyFiltersLoading(bool) {
  return {
    type: 'PROJECTED_VACANCY_FILTERS_LOADING',
    isLoading: bool,
  };
}
export function projectedVacancyFiltersSuccess(results) {
  return {
    type: 'PROJECTED_VACANCY_FILTERS_SUCCESS',
    results,
  };
}
export function projectedVacancyFilters() {
  return (dispatch) => {
    if (cancelPVFilters) { cancelPVFilters('cancel'); }
    batch(() => {
      dispatch(projectedVacancyFiltersLoading(true));
      dispatch(projectedVacancyFiltersErrored(false));
    });
    api().get('/fsbid/admin/projected_vacancies/filters/', {
      cancelToken: new CancelToken((c) => { cancelPVFilters = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(projectedVacancyFiltersSuccess(data));
          dispatch(projectedVacancyFiltersErrored(false));
          dispatch(projectedVacancyFiltersLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(projectedVacancyFiltersSuccess({}));
            dispatch(projectedVacancyFiltersErrored(true));
            dispatch(projectedVacancyFiltersLoading(false));
          });
        }
      });
  };
}

// ================ GET LANGUAGE OFFSET OPTIONS ================

export function projectedVacancyLangOffsetOptionsErrored(bool) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSET_OPTIONS_ERRORED',
    hasErrored: bool,
  };
}
export function projectedVacancyLangOffsetOptionsLoading(bool) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSET_OPTIONS_LOADING',
    isLoading: bool,
  };
}
export function projectedVacancyLangOffsetOptionsSuccess(results) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSET_OPTIONS_SUCCESS',
    results,
  };
}
export function projectedVacancyLangOffsetOptions() {
  return (dispatch) => {
    if (cancelPVLangOffsetOptions) { cancelPVLangOffsetOptions('cancel'); }
    batch(() => {
      dispatch(projectedVacancyLangOffsetOptionsLoading(true));
      dispatch(projectedVacancyLangOffsetOptionsErrored(false));
    });
    api().get('/fsbid/admin/projected_vacancies/language_offset_options/', {
      cancelToken: new CancelToken((c) => { cancelPVLangOffsetOptions = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(projectedVacancyLangOffsetOptionsSuccess(data));
          dispatch(projectedVacancyLangOffsetOptionsErrored(false));
          dispatch(projectedVacancyLangOffsetOptionsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(projectedVacancyLangOffsetOptionsSuccess({}));
            dispatch(projectedVacancyLangOffsetOptionsErrored(true));
            dispatch(projectedVacancyLangOffsetOptionsLoading(false));
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


// ================ GET LANGUAGE OFFSET DATA ================

export function projectedVacancyLangOffsetsErrored(bool) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSETS_ERRORED',
    hasErrored: bool,
  };
}
export function projectedVacancyLangOffsetsLoading(bool) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSETS_LOADING',
    isLoading: bool,
  };
}
export function projectedVacancyLangOffsetsSuccess(results) {
  return {
    type: 'PROJECTED_VACANCY_LANG_OFFSETS_SUCCESS',
    results,
  };
}
export function projectedVacancyLangOffsets(query = {}) {
  return (dispatch) => {
    if (cancelPVLangOffsets) { cancelPVLangOffsets('cancel'); }
    batch(() => {
      dispatch(projectedVacancyLangOffsetsLoading(true));
      dispatch(projectedVacancyLangOffsetsErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/admin/projected_vacancies/language_offsets/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelPVLangOffsets = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(projectedVacancyLangOffsetsSuccess(data));
          dispatch(projectedVacancyLangOffsetsErrored(false));
          dispatch(projectedVacancyLangOffsetsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(projectedVacancyLangOffsetsSuccess({}));
            dispatch(projectedVacancyLangOffsetsErrored(true));
            dispatch(projectedVacancyLangOffsetsLoading(false));
          });
        }
      });
  };
}
