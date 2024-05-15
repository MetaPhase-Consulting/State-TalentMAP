// ================ Bid Audit: Get List ================

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
export function bidAuditFetchData(state = [], action) {
  switch (action.type) {
    case 'BID_AUDIT_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ Bid Audit: Get Cycles ================

export function bidAuditFetchCyclesLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_CYCLE_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function bidAuditCycles(state = [], action) {
  switch (action.type) {
    case 'BID_AUDIT_CYCLE_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ Bid Audit: Get In Category/At Grade ================

export function bidAuditSecondFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_SECOND_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function bidAuditSecondFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_SECOND_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function bidAuditSecondFetchData(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_SECOND_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ----------------------------------------------------------------------
// ================ FUNCTIONS BELOW ARE CURRENTLY UNUSED ================
// ----------------------------------------------------------------------

// ================ Bid Audit: Get Audit ================

export function bidAuditErrored(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function bidAuditLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_EDIT_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}


// ================ Bid Audit: Edit ================

export function bidAuditEdit(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Bid Audit: Delete ================

export function bidAuditDeleteLoading(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_DELETE_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function bidAuditDeleteDataSuccess(state = false, action) {
  switch (action.type) {
    case 'BID_AUDIT_DELETE_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Bid Audit: Get Card ================

export function bidAuditCard(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_CARD_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Bid Audit: Get Category Card ================

export function bidAuditCategoryCard(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_CARD_CAT_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Bid Audit: User Filter Selections ================

export function bidAuditSelections(state = {}, action) {
  switch (action.type) {
    case 'BID_AUDIT_SELECTIONS_SAVE_SUCCESS':
      return action.result;
    default:
      return state;
  }
}


// ================ Bid Audit: Filters ================

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
