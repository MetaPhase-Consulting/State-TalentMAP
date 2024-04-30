import { batch } from 'react-redux';
import api from '../api';

// ================ ASSIGNMENT HISTORY LIST ================

export function assignmentHasErrored(bool) {
  return {
    type: 'ASSIGNMENT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function assignmentIsLoading(bool) {
  return {
    type: 'ASSIGNMENT_IS_LOADING',
    isLoading: bool,
  };
}
export function assignmentFetchDataSuccess(assignment) {
  return {
    type: 'ASSIGNMENT_FETCH_DATA_SUCCESS',
    assignment,
  };
}
export function assignmentFetchData(id) {
  return (dispatch) => {
    batch(() => {
      dispatch(assignmentIsLoading(true));
      dispatch(assignmentHasErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${id ? `${id}/` : ''}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(assignmentFetchDataSuccess(data));
          dispatch(assignmentIsLoading(false));
          dispatch(assignmentHasErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(assignmentHasErrored(true));
          dispatch(assignmentIsLoading(false));
        });
      });
  };
}

// ================ ALTERNATIVE ASSIGNMENT LIST ================
// Uses FSBID fields 1:1 to fetch all assignments and separations for perdet

export function altAssignmentsErrored(bool) {
  return {
    type: 'ALT_ASSIGNMENTS_SEPARATIONS_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function altAssignmentsLoading(bool) {
  return {
    type: 'ALT_ASSIGNMENTS_SEPARATIONS_FETCH_LOADING',
    isLoading: bool,
  };
}
export function altAssignmentsSuccess(data) {
  return {
    type: 'ALT_ASSIGNMENTS_SEPARATIONS_FETCH_SUCCESS',
    data,
  };
}
export function altAssignmentsFetch(id) {
  return (dispatch) => {
    batch(() => {
      dispatch(altAssignmentsLoading(true));
      dispatch(altAssignmentsErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${id}/assignments-separations/`)
      .then(({ data }) => {
        batch(() => {
          dispatch(altAssignmentsSuccess(data));
          dispatch(altAssignmentsLoading(false));
          dispatch(altAssignmentsErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentsErrored(true));
          dispatch(altAssignmentsLoading(false));
        });
      });
  };
}

// ================ ALTERNATIVE ASSIGNMENT DETAIL ================
// Uses FSBID fields 1:1 to fetch assignment detail and ref data

export function altAssignmentErrored(bool) {
  return {
    type: 'ALT_ASSIGNMENT_FETCH_ERRORED',
    hasErrored: bool,
  };
}
export function altAssignmentLoading(bool) {
  return {
    type: 'ALT_ASSIGNMENT_FETCH_LOADING',
    isLoading: bool,
  };
}
export function altAssignmentSuccess(data) {
  return {
    type: 'ALT_ASSIGNMENT_FETCH_SUCCESS',
    data,
  };
}
export function altAssignmentFetch(perdet, asgId, revision_num) {
  return (dispatch) => {
    batch(() => {
      dispatch(altAssignmentLoading(true));
      dispatch(altAssignmentErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${perdet}/assignments/${asgId}/?revision_num=${revision_num}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(altAssignmentSuccess(data));
          dispatch(altAssignmentLoading(false));
          dispatch(altAssignmentErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentErrored(true));
          dispatch(altAssignmentLoading(false));
        });
      });
  };
}

// ================ UPDATE ASSIGNMENT ================

export function updateAssignment(query, perdet, id) {
  return (dispatch) => {
    api()
      .patch(`/fsbid/assignment_history/${perdet}/assignments/${id}/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentsFetch(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentsErrored(true));
          dispatch(altAssignmentsLoading(false));
        });
      });
  };
}

// ================ CREATE ASSIGNMENT ================

export function createAssignment(query, perdet) {
  return (dispatch) => {
    api()
      .post(`/fsbid/assignment_history/${perdet}/assignments/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentsFetch(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentsErrored(true));
          dispatch(altAssignmentsLoading(false));
        });
      });
  };
}

// ================ ALTERNATIVE SEPARATION DETAIL ================
// Uses FSBID fields 1:1 to fetch separation detail and ref data

export function altSeparationErrored(bool) {
  return {
    type: 'ALT_SEPARATION_ERRORED',
    hasErrored: bool,
  };
}
export function altSeparationLoading(bool) {
  return {
    type: 'ALT_SEPARATION_LOADING',
    isLoading: bool,
  };
}
export function altSeparationSuccess(data) {
  return {
    type: 'ALT_SEPARATION_SUCCESS',
    data,
  };
}
export function altSeparation(perdet, sepId, revision_num) {
  return (dispatch) => {
    batch(() => {
      dispatch(altSeparationLoading(true));
      dispatch(altSeparationErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${perdet}/separations/${sepId}/?revision_num=${revision_num}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(altSeparationSuccess(data));
          dispatch(altSeparationLoading(false));
          dispatch(altSeparationErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altSeparationErrored(true));
          dispatch(altSeparationLoading(false));
        });
      });
  };
}

// ================ UPDATE SEPARATION ================

export function updateSeparation(query, perdet, id) {
  return (dispatch) => {
    api()
      .patch(`/fsbid/assignment_history/${perdet}/separations/${id}/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentsFetch(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentsErrored(true));
          dispatch(altAssignmentsLoading(false));
        });
      });
  };
}

// ================ CREATE SEPARATION ================

export function createSeparation(query, perdet) {
  return (dispatch) => {
    api()
      .post(`/fsbid/assignment_history/${perdet}/separations/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentsFetch(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentsErrored(true));
          dispatch(altAssignmentsLoading(false));
        });
      });
  };
}
