import { batch } from 'react-redux';
import { CancelToken } from 'axios';
import { convertQueryToString } from 'utilities';
import {
  ASSIGNMENT_CYCLE_CREATE_ERROR,
  ASSIGNMENT_CYCLE_CREATE_ERROR_TITLE,
  ASSIGNMENT_CYCLE_CREATE_SUCCESS,
  ASSIGNMENT_CYCLE_CREATE_SUCCESS_TITLE,
  ASSIGNMENT_CYCLE_DELETE_ERROR,
  ASSIGNMENT_CYCLE_DELETE_ERROR_TITLE,
  ASSIGNMENT_CYCLE_DELETE_SUCCESS,
  ASSIGNMENT_CYCLE_DELETE_SUCCESS_TITLE,
  ASSIGNMENT_CYCLE_EDIT_ERROR,
  ASSIGNMENT_CYCLE_EDIT_ERROR_TITLE,
  ASSIGNMENT_CYCLE_EDIT_SUCCESS,
  ASSIGNMENT_CYCLE_EDIT_SUCCESS_TITLE,
  ASSIGNMENT_CYCLE_MERGE_ERROR,
  ASSIGNMENT_CYCLE_MERGE_ERROR_TITLE,
  ASSIGNMENT_CYCLE_MERGE_SUCCESS,
  ASSIGNMENT_CYCLE_MERGE_SUCCESS_TITLE,
  ASSIGNMENT_CYCLE_POST_POSITIONS_ERROR,
  ASSIGNMENT_CYCLE_POST_POSITIONS_ERROR_TITLE,
  ASSIGNMENT_CYCLE_POST_POSITIONS_SUCCESS,
  ASSIGNMENT_CYCLE_POST_POSITIONS_TITLE,
  EDIT_CYCLE_CLASSIFICATIONS_ERROR,
  EDIT_CYCLE_CLASSIFICATIONS_ERROR_TITLE,
  EDIT_CYCLE_CLASSIFICATIONS_SUCCESS,
  EDIT_CYCLE_CLASSIFICATIONS_SUCCESS_TITLE,
  EDIT_CYCLE_POSITION_ERROR,
  EDIT_CYCLE_POSITION_ERROR_TITLE,
  EDIT_CYCLE_POSITION_SUCCESS,
  EDIT_CYCLE_POSITION_SUCCESS_TITLE,
  REMOVE_CYCLE_POSITION_ERROR,
  REMOVE_CYCLE_POSITION_ERROR_TITLE,
  REMOVE_CYCLE_POSITION_SUCCESS,
  REMOVE_CYCLE_POSITION_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import api from '../api';
import { toastError, toastSuccess } from './toast';


// ================ Cycle Management: Get Cycles ================

let cancelCycleManagementFetch;

export function cycleManagementFetchDataErrored(bool) {
  return {
    type: 'CYCLE_MANAGEMENT_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function cycleManagementFetchDataLoading(bool) {
  return {
    type: 'CYCLE_MANAGEMENT_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function cycleManagementFetchDataSuccess(results) {
  return {
    type: 'CYCLE_MANAGEMENT_FETCH_SUCCESS',
    results,
  };
}
export function cycleManagementFetchData() {
  return (dispatch) => {
    if (cancelCycleManagementFetch) {
      cancelCycleManagementFetch('cancel');
    }
    batch(() => {
      dispatch(cycleManagementFetchDataLoading(true));
      dispatch(cycleManagementFetchDataErrored(false));
    });
    const endpoint = '/fsbid/assignment_cycles/';
    api().get(endpoint, {
      cancelToken: new CancelToken((c) => { cancelCycleManagementFetch = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cycleManagementFetchDataSuccess(data));
          dispatch(cycleManagementFetchDataErrored(false));
          dispatch(cycleManagementFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cycleManagementFetchDataSuccess([]));
            dispatch(cycleManagementFetchDataErrored(true));
            dispatch(cycleManagementFetchDataLoading(false));
          });
        }
      });
  };
}

// ================ Cycle Management: User Filter Selections ================

export function cycleManagementSelectionsSaveSuccess(result) {
  return {
    type: 'CYCLE_MANAGEMENT_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}
export function saveCycleManagementSelections(queryObject) {
  return (dispatch) => dispatch(cycleManagementSelectionsSaveSuccess(queryObject));
}


// ================ Cycle Management: Create Cycle ================

let cancelCycleManagementCreate;

export function cycleManagementCreateCycle(data) {
  return (dispatch) => {
    if (cancelCycleManagementCreate) {
      cancelCycleManagementCreate('cancel');
    }
    api()
      .post('/fsbid/assignment_cycles/create/', {
        data,
      }, {
        cancelToken: new CancelToken((c) => { cancelCycleManagementCreate = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(
            ASSIGNMENT_CYCLE_CREATE_SUCCESS, ASSIGNMENT_CYCLE_CREATE_SUCCESS_TITLE,
          ));
          dispatch(cycleManagementFetchData());
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(ASSIGNMENT_CYCLE_CREATE_ERROR, ASSIGNMENT_CYCLE_CREATE_ERROR_TITLE));
        }
      });
  };
}


// ================ Cycle Management: Get Cycle ================

let cancelCycleManagementGetCycle;

export function cycleManagementAssignmentCycleFetchDataErrored(bool) {
  return {
    type: 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function cycleManagementAssignmentCycleFetchDataLoading(bool) {
  return {
    type: 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function cycleManagementAssignmentCycleFetchDataSuccess(results) {
  return {
    type: 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_SUCCESS',
    results,
  };
}
export function cycleManagementAssignmentCycleFetchData(id) {
  return (dispatch) => {
    if (cancelCycleManagementGetCycle) {
      cancelCycleManagementGetCycle('cancel');
    }
    batch(() => {
      dispatch(cycleManagementAssignmentCycleFetchDataLoading(true));
      dispatch(cycleManagementAssignmentCycleFetchDataErrored(false));
    });
    api().get(`/fsbid/assignment_cycles/${id}/`, {
      cancelToken: new CancelToken((c) => { cancelCycleManagementGetCycle = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cycleManagementAssignmentCycleFetchDataSuccess(data));
          dispatch(cycleManagementAssignmentCycleFetchDataErrored(false));
          dispatch(cycleManagementAssignmentCycleFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cycleManagementAssignmentCycleFetchDataSuccess({}));
            dispatch(cycleManagementAssignmentCycleFetchDataErrored(true));
            dispatch(cycleManagementAssignmentCycleFetchDataLoading(false));
          });
        }
      });
  };
}


// ================ Cycle Management: Update Cycle ================

let cancelCycleManagementUpdate;

export function cycleManagementUpdateCycleSuccess(bool) {
  return {
    type: 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_UPDATE_SUCCESS',
    success: bool,
  };
}
export function cycleManagementUpdateCycle(data) {
  return (dispatch) => {
    if (cancelCycleManagementUpdate) {
      cancelCycleManagementUpdate('cancel');
    }
    api()
      .post('/fsbid/assignment_cycles/update/', {
        data,
      }, {
        cancelToken: new CancelToken((c) => { cancelCycleManagementUpdate = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(
            ASSIGNMENT_CYCLE_EDIT_SUCCESS, ASSIGNMENT_CYCLE_EDIT_SUCCESS_TITLE,
          ));
          dispatch(cycleManagementUpdateCycleSuccess(true));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(toastError(ASSIGNMENT_CYCLE_EDIT_ERROR, ASSIGNMENT_CYCLE_EDIT_ERROR_TITLE));
        }
      });
  };
}


// ================ Cycle Management: Post Open Positions ================

let cancelCycleManagementPostPositions;

export function cycleManagementPostOpenPositions(id) {
  return (dispatch) => {
    if (cancelCycleManagementPostPositions) {
      cancelCycleManagementPostPositions('cancel');
    }
    dispatch(cycleManagementUpdateCycleSuccess(false));
    api()
      .get(`/fsbid/assignment_cycles/post/${id}/`, {
        cancelToken: new CancelToken((c) => { cancelCycleManagementPostPositions = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(
            ASSIGNMENT_CYCLE_POST_POSITIONS_SUCCESS, ASSIGNMENT_CYCLE_POST_POSITIONS_TITLE,
          ));
          dispatch(cycleManagementUpdateCycleSuccess(true));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          dispatch(
            toastError(
              ASSIGNMENT_CYCLE_POST_POSITIONS_ERROR,
              ASSIGNMENT_CYCLE_POST_POSITIONS_ERROR_TITLE,
            ),
          );
        }
      });
  };
}


// ================ Cycle Management: Delete Cycle ================

let cancelCycleManagementDelete;

export function cycleManagementDeleteCycleSuccess(bool) {
  return {
    type: 'ASSIGNMENT_CYCLE_DELETE_SUCCESS',
    success: bool,
  };
}
export function cycleManagementDeleteCycle(data) {
  return (dispatch) => {
    if (cancelCycleManagementDelete) {
      cancelCycleManagementDelete('cancel');
    }
    dispatch(cycleManagementDeleteCycleSuccess(false));
    api()
      .post('/fsbid/assignment_cycles/delete/', {
        data,
      }, {
        cancelToken: new CancelToken((c) => { cancelCycleManagementDelete = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(ASSIGNMENT_CYCLE_DELETE_SUCCESS,
            ASSIGNMENT_CYCLE_DELETE_SUCCESS_TITLE));
          dispatch(cycleManagementDeleteCycleSuccess(true));
        });
      },
      ).catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(
              toastError(
                ASSIGNMENT_CYCLE_DELETE_ERROR,
                ASSIGNMENT_CYCLE_DELETE_ERROR_TITLE,
              ),
            );
          });
        }
      });
  };
}


// ================ Cycle Management: Merge Cycle ================

let cancelCycleManagementMerge;

export function cycleManagementMergeCycleSuccess(bool) {
  return {
    type: 'ASSIGNMENT_CYCLE_MERGE_SUCCESS',
    success: bool,
  };
}
export function cycleManagementMergeCycle(data) {
  return (dispatch) => {
    if (cancelCycleManagementMerge) {
      cancelCycleManagementMerge('cancel');
    }
    dispatch(cycleManagementMergeCycleSuccess(false));
    api()
      .post('/fsbid/assignment_cycles/merge/', {
        data,
      }, {
        cancelToken: new CancelToken((c) => { cancelCycleManagementMerge = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(ASSIGNMENT_CYCLE_MERGE_SUCCESS,
            ASSIGNMENT_CYCLE_MERGE_SUCCESS_TITLE));
          dispatch(cycleManagementMergeCycleSuccess(true));
        });
      },
      ).catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(
              toastError(
                ASSIGNMENT_CYCLE_MERGE_ERROR,
                ASSIGNMENT_CYCLE_MERGE_ERROR_TITLE,
              ),
            );
          });
        }
      });
  };
}


// ================ Cycle Classifications: Get Classifications ================

let cancelCycleClassificationsFetch;

export function cycleClassificationsIsLoading(bool) {
  return {
    type: 'CYCLE_CLASSIFICATIONS_IS_LOADING',
    isLoading: bool,
  };
}
export function cycleClassificationsFetchDataSuccess(results) {
  return {
    type: 'CYCLE_CLASSIFICATIONS_FETCH_DATA_SUCCESS',
    results,
  };
}
export function cycleClassificationsFetchData() {
  return (dispatch) => {
    if (cancelCycleClassificationsFetch) {
      cancelCycleClassificationsFetch('cancel');
    }
    batch(() => {
      dispatch(cycleClassificationsIsLoading(true));
    });
    const endpoint = '/fsbid/assignment_cycles/classifications/';
    api().get(endpoint, {
      cancelToken: new CancelToken((c) => { cancelCycleClassificationsFetch = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cycleClassificationsFetchDataSuccess(data));
          dispatch(cycleClassificationsIsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cycleClassificationsFetchDataSuccess([]));
            dispatch(cycleClassificationsIsLoading(false));
          });
        }
      });
  };
}


// ================ Cycle Classifications: Edit Classifications ================

let cancelCycleClassificationsEdit;

export function cycleClassificationsEditCycleSuccess(bool) {
  return {
    type: 'CYCLE_CLASSIFICATIONS_EDIT_SUCCESS',
    success: bool,
  };
}
export function cycleClassificationsEditCycle(data) {
  return (dispatch) => {
    if (cancelCycleClassificationsEdit) {
      cancelCycleClassificationsEdit('cancel');
    }
    api()
      .post('/fsbid/assignment_cycles/classifications/update/', {
        data,
      }, {
        cancelToken: new CancelToken((c) => { cancelCycleClassificationsEdit = c; }),
      })
      .then(() => {
        batch(() => {
          dispatch(toastSuccess(
            EDIT_CYCLE_CLASSIFICATIONS_SUCCESS, EDIT_CYCLE_CLASSIFICATIONS_SUCCESS_TITLE,
          ));
          dispatch(cycleClassificationsEditCycleSuccess(true));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(toastError(
              EDIT_CYCLE_CLASSIFICATIONS_ERROR, EDIT_CYCLE_CLASSIFICATIONS_ERROR_TITLE,
            ));
          });
        }
      });
  };
}


// ================ Cycle Positions: Filters ================

let cancelCPfiltersData;

export function cyclePositionFiltersLoading(bool) {
  return {
    type: 'CYCLE_POSITIONS_FILTERS_IS_LOADING',
    isLoading: bool,
  };
}
export function cyclePositionFiltersSuccess(results) {
  return {
    type: 'CYCLE_POSITIONS_FILTERS_SUCCESS',
    results,
  };
}
export function cyclePositionFiltersFetchData() {
  return (dispatch) => {
    if (cancelCPfiltersData) { cancelCPfiltersData('cancel'); dispatch(cyclePositionFiltersLoading(true)); }
    batch(() => {
      dispatch(cyclePositionFiltersLoading(true));
    });
    api().get('/fsbid/assignment_cycles/positions/filters/', {
      cancelToken: new CancelToken((c) => { cancelCPfiltersData = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cyclePositionFiltersSuccess(data));
          dispatch(cyclePositionFiltersLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cyclePositionFiltersSuccess({}));
            dispatch(cyclePositionFiltersLoading(false));
          });
        }
      });
  };
}


// ================ Cycle Positions: User Filter Selections ================

export function cyclePositionSearchSelectionsSaveSuccess(result) {
  return {
    type: 'CYCLE_POSITIONS_SEARCH_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}
export function saveCyclePositionSearchSelections(queryObject) {
  return (dispatch) => dispatch(cyclePositionSearchSelectionsSaveSuccess(queryObject));
}


// ================ Cycle Positions: Get Positions ================

let cancelCPfetch;

export function cyclePositionSearchFetchDataErrored(bool) {
  return {
    type: 'CYCLE_POSITION_SEARCH_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function cyclePositionSearchFetchDataLoading(bool) {
  return {
    type: 'CYCLE_POSITION_SEARCH_FETCH_IS_LOADING',
    isLoading: bool,
  };
}
export function cyclePositionSearchFetchDataSuccess(results) {
  return {
    type: 'CYCLE_POSITION_SEARCH_FETCH_SUCCESS',
    results,
  };
}
export function cyclePositionSearchFetchData(query = {}) {
  return (dispatch) => {
    if (cancelCPfetch) {
      cancelCPfetch('cancel');
    }
    batch(() => {
      dispatch(cyclePositionSearchFetchDataLoading(true));
      dispatch(cyclePositionSearchFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    api().get(`/fsbid/assignment_cycles/positions/?${q}`, {
      cancelToken: new CancelToken((c) => { cancelCPfetch = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(cyclePositionSearchFetchDataSuccess(data));
          dispatch(cyclePositionSearchFetchDataErrored(false));
          dispatch(cyclePositionSearchFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message !== 'cancel') {
          batch(() => {
            dispatch(cyclePositionSearchFetchDataSuccess([]));
            dispatch(cyclePositionSearchFetchDataErrored(true));
            dispatch(cyclePositionSearchFetchDataLoading(false));
          });
        }
      });
  };
}


// ================ Cycle Positions: Remove Position ================

let cancelCPremove;

export function cyclePositionRemoveHasErrored(bool) {
  return {
    type: 'CYCLE_POSITION_REMOVE_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function cyclePositionRemoveIsLoading(bool) {
  return {
    type: 'CYCLE_POSITION_REMOVE_IS_LOADING',
    isLoading: bool,
  };
}
export function cyclePositionRemoveSuccess(data) {
  return {
    type: 'CYCLE_POSITION_REMOVE_SUCCESS',
    data,
  };
}
export function cyclePositionRemove(position) {
  return (dispatch) => {
    if (cancelCPremove) { cancelCPremove('cancel'); }
    dispatch(cyclePositionRemoveIsLoading(true));
    dispatch(cyclePositionRemoveHasErrored(false));
    api()
      .post('/placeholder/POST/endpoint', {
        position,
      }, {
        cancelToken: new CancelToken((c) => {
          cancelCPremove = c;
        }),
      })
      .then(({ data }) => {
        batch(() => {
          dispatch(cyclePositionRemoveHasErrored(false));
          dispatch(cyclePositionRemoveSuccess(data || []));
          dispatch(
            toastSuccess(REMOVE_CYCLE_POSITION_SUCCESS, REMOVE_CYCLE_POSITION_SUCCESS_TITLE));
          dispatch(cyclePositionRemoveIsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          dispatch(cyclePositionRemoveHasErrored(false));
          dispatch(cyclePositionRemoveIsLoading(false));
        } else {
          dispatch(toastError(REMOVE_CYCLE_POSITION_ERROR, REMOVE_CYCLE_POSITION_ERROR_TITLE));
          dispatch(cyclePositionRemoveHasErrored(true));
          dispatch(cyclePositionRemoveIsLoading(false));
        }
      });
  };
}


// ================ Cycle Positions: Edit Position ================

let cancelCPedit;

export function cyclePositionEditHasErrored(bool) {
  return {
    type: 'CYCLE_POSITION_EDIT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function cyclePositionEditIsLoading(bool) {
  return {
    type: 'CYCLE_POSITION_EDIT_IS_LOADING',
    isLoading: bool,
  };
}
export function cyclePositionEditSuccess(data) {
  return {
    type: 'CYCLE_POSITION_EDIT_SUCCESS',
    data,
  };
}
export function cyclePositionEdit(position, incumbent, status) {
  return (dispatch) => {
    if (cancelCPedit) { cancelCPedit('cancel'); }
    dispatch(cyclePositionEditIsLoading(true));
    dispatch(cyclePositionEditHasErrored(false));
    api()
      .post('/placeholder/POST/endpoint', {
        position,
        incumbent,
        status,
      }, {
        cancelToken: new CancelToken((c) => {
          cancelCPedit = c;
        }),
      })
      .then(({ data }) => {
        batch(() => {
          dispatch(cyclePositionEditHasErrored(false));
          dispatch(cyclePositionEditSuccess(data || []));
          dispatch(
            toastSuccess(EDIT_CYCLE_POSITION_SUCCESS, EDIT_CYCLE_POSITION_SUCCESS_TITLE));
          dispatch(cyclePositionEditIsLoading(false));
        });
      })
      .catch((err) => {
        if (err?.message === 'cancel') {
          dispatch(cyclePositionEditHasErrored(false));
          dispatch(cyclePositionEditIsLoading(false));
        } else {
          dispatch(toastError(EDIT_CYCLE_POSITION_ERROR, EDIT_CYCLE_POSITION_ERROR_TITLE));
          dispatch(cyclePositionEditHasErrored(true));
          dispatch(cyclePositionEditIsLoading(false));
        }
      });
  };
}
