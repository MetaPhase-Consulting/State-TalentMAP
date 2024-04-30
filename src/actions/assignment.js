import { batch } from 'react-redux';
import api from '../api';

// ================ ASSIGNMENT LIST ================

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

// ================ ALT ASSIGNMENT LIST ================
// Alt Assignment is using FSBID procs 1:1 to fetch all assignments for perdet

export function altAssignmentHasErrored(bool) {
  return {
    type: 'ALT_ASSIGNMENT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function altAssignmentIsLoading(bool) {
  return {
    type: 'ALT_ASSIGNMENT_IS_LOADING',
    isLoading: bool,
  };
}
export function altAssignmentFetchDataSuccess(altAssignment) {
  return {
    type: 'ALT_ASSIGNMENT_FETCH_DATA_SUCCESS',
    altAssignment,
  };
}
export function altAssignmentFetchData(id) {
  return (dispatch) => {
    batch(() => {
      dispatch(altAssignmentIsLoading(true));
      dispatch(altAssignmentHasErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${id}/alt/`)
      .then(({ data }) => {
        batch(() => {
          dispatch(altAssignmentFetchDataSuccess(data));
          dispatch(altAssignmentIsLoading(false));
          dispatch(altAssignmentHasErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentHasErrored(true));
          dispatch(altAssignmentIsLoading(false));
        });
      });
  };
}

// ================ ALT ASSIGNMENT DETAIL ================
// Alt Assignment details is using FSBID procs 1:1 to fetch single assignments and ref data

export function altAssignmentDetailHasErrored(bool) {
  return {
    type: 'ALT_ASSIGNMENT_DETAIL_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function altAssignmentDetailIsLoading(bool) {
  return {
    type: 'ALT_ASSIGNMENT_DETAIL_IS_LOADING',
    isLoading: bool,
  };
}
export function altAssignmentDetailFetchDataSuccess(altAssignmentDetail) {
  return {
    type: 'ALT_ASSIGNMENT_DETAIL_FETCH_DATA_SUCCESS',
    altAssignmentDetail,
  };
}
export function altAssignmentDetailFetchData(perdet, asgId, revision_num) {
  return (dispatch) => {
    batch(() => {
      dispatch(altAssignmentDetailIsLoading(true));
      dispatch(altAssignmentDetailHasErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${perdet}/assignment/${asgId}/?revision_num=${revision_num}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(altAssignmentDetailFetchDataSuccess(data));
          dispatch(altAssignmentDetailIsLoading(false));
          dispatch(altAssignmentDetailHasErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentDetailHasErrored(true));
          dispatch(altAssignmentDetailIsLoading(false));
        });
      });
  };
}

// ================ UPDATE ASSIGNMENT ================

export function updateAssignment(query, perdet) {
  return (dispatch) => {
    api()
      .patch(`/fsbid/assignment_history/${perdet}/alt/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentFetchData(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentHasErrored(true));
          dispatch(altAssignmentIsLoading(false));
        });
      });
  };
}

// ================ CREATE ASSIGNMENT ================

export function createAssignment(query, perdet) {
  return (dispatch) => {
    api()
      .post(`/fsbid/assignment_history/${perdet}/alt/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentFetchData(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentHasErrored(true));
          dispatch(altAssignmentIsLoading(false));
        });
      });
  };
}

// ================ SEPARATION DETAIL ================

export function separationDetailErrored(bool) {
  return {
    type: 'SEPARATION_DETAIL_ERRORED',
    hasErrored: bool,
  };
}
export function separationDetailLoading(bool) {
  return {
    type: 'SEPARATION_DETAIL_LOADING',
    isLoading: bool,
  };
}
export function separationDetailSuccess(data) {
  return {
    type: 'SEPARATION_DETAIL_SUCCESS',
    data,
  };
}
export function separationDetail(perdet, asgId, revision_num) {
  return (dispatch) => {
    batch(() => {
      dispatch(separationDetailLoading(true));
      dispatch(separationDetailErrored(false));
    });
    api()
      .get(`/fsbid/assignment_history/${perdet}/assignment/${asgId}/?revision_num=${revision_num}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(separationDetailSuccess(data));
          dispatch(separationDetailLoading(false));
          dispatch(separationDetailErrored(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(separationDetailErrored(true));
          dispatch(separationDetailLoading(false));
        });
      });
  };
}

// ================ UPDATE SEPARATION ================

export function updateSeparation(query, perdet) {
  return (dispatch) => {
    api()
      .patch(`/fsbid/assignment_history/${perdet}/alt/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentFetchData(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentHasErrored(true));
          dispatch(altAssignmentIsLoading(false));
        });
      });
  };
}

// ================ CREATE SEPARATION ================

export function createSeparation(query, perdet) {
  return (dispatch) => {
    api()
      .post(`/fsbid/assignment_history/${perdet}/alt/`, query)
      .then(() => {
        batch(() => {
          dispatch(altAssignmentFetchData(perdet));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(altAssignmentHasErrored(true));
          dispatch(altAssignmentIsLoading(false));
        });
      });
  };
}
