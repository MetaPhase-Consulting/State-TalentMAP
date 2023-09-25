export function bidAuditEditErrored(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_EDIT_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function bidAuditEditLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_EDIT_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function bidAuditEdit(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_EDIT_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

export function bidAuditFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function bidAuditFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}

export function bidAudit(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

export function bidAuditSelections(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_SELECTIONS_SAVE_SUCCESS':
      return action.result;
    default:
      return state;
  }
}

export function bidAuditFiltersFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_FILTERS_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function bidAuditFiltersFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_FILTERS_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function bidAuditFilters(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_FILTERS_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
