// ================ ASSIGNMENT LIST ================

export function assignmentHasErrored(state = false, action) {
  switch (action.type) {
    case 'ASSIGNMENT_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function assignmentIsLoading(state = true, action) {
  switch (action.type) {
    case 'ASSIGNMENT_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function assignment(state = [], action) {
  switch (action.type) {
    case 'ASSIGNMENT_FETCH_DATA_SUCCESS':
      return action.assignment;
    default:
      return state;
  }
}

// ================ ALT ASSIGNMENT LIST ================
// Alt Assignment uses FSBID 1:1 proc

export function altAssignmentHasErrored(state = false, action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function altAssignmentIsLoading(state = true, action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function altAssignment(state = [], action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_FETCH_DATA_SUCCESS':
      return action.altAssignment;
    default:
      return state;
  }
}

// ================ ALT ASSIGNMENT DETAIL ================
// Alt Assignment Detail uses FSBID 1:1 proc for ref data and options

export function altAssignmentDetailHasErrored(state = false, action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_DETAIL_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function altAssignmentDetailIsLoading(state = true, action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_DETAIL_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function altAssignmentDetail(state = [], action) {
  switch (action.type) {
    case 'ALT_ASSIGNMENT_DETAIL_FETCH_DATA_SUCCESS':
      return action.altAssignmentDetail;
    default:
      return state;
  }
}

// ================ SEPARATION DETAIL ================

export function separationDetailErrored(state = false, action) {
  switch (action.type) {
    case 'SEPARATION_DETAIL_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function separationDetailLoading(state = true, action) {
  switch (action.type) {
    case 'SEPARATION_DETAIL_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function separationDetail(state = [], action) {
  switch (action.type) {
    case 'SEPARATION_DETAIL_SUCCESS':
      return action.altAssignmentDetail;
    default:
      return state;
  }
}
