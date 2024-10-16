// ================ Cycle Management: Get Cycles ================

export function cycleManagementFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function cycleManagementFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cycleManagement(state = [], action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Cycle Management: User Filter Selections ================

export function cycleManagementSelections(state = {}, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_SELECTIONS_SAVE_SUCCESS':
      return action.result;
    default:
      return state;
  }
}


// ================ Cycle Management: Get Cycle ================

export function cycleManagementAssignmentCycleFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function cycleManagementAssignmentCycleFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cycleManagementAssignmentCycle(state = {}, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Cycle Management: Update Cycle ================

export function cycleManagementAssignmentCycleUpdateSuccess(state = false, action) {
  switch (action.type) {
    case 'CYCLE_MANAGEMENT_ASSIGNMENT_CYCLE_UPDATE_SUCCESS':
      return action.success;
    default:
      return state;
  }
}


// ================ Cycle Management: Delete Cycle ================

export function cycleManagementDelete(state = false, action) {
  switch (action.type) {
    case 'ASSIGNMENT_CYCLE_DELETE_SUCCESS':
      return action.success;
    default:
      return state;
  }
}


// ================ Cycle Management: Merge Cycle ================

export function cycleManagementMerge(state = false, action) {
  switch (action.type) {
    case 'ASSIGNMENT_CYCLE_MERGE_SUCCESS':
      return action.success;
    default:
      return state;
  }
}

// ================ Cycle Classifications: Get Classifications ================

export function cycleClassificationsIsLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_CLASSIFICATIONS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cycleClassificationsData(state = [], action) {
  switch (action.type) {
    case 'CYCLE_CLASSIFICATIONS_FETCH_DATA_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Cycle Classifications: Edit Classifications ================

export function cycleClassificationsEditSuccess(state = false, action) {
  switch (action.type) {
    case 'CYCLE_CLASSIFICATIONS_EDIT_SUCCESS':
      return action.success;
    default:
      return state;
  }
}


// ================ Cycle Positions: Filters ================

export function cyclePositionFiltersIsLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITIONS_FILTERS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cyclePositionsFilters(state = {}, action) {
  switch (action.type) {
    case 'CYCLE_POSITIONS_FILTERS_SUCCESS':
      return action.results;
    default:
      return state;
  }
}


// ================ Cycle Positions: User Filter Selections ================

export function cyclePositionSearchSelections(state = {}, action) {
  switch (action.type) {
    case 'CYCLE_POSITIONS_SEARCH_SELECTIONS_SAVE_SUCCESS':
      return action.result;
    default:
      return state;
  }
}


// ================ Cycle Positions: Get Positions ================

export function cyclePositionSearchFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITION_SEARCH_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function cyclePositionSearchFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITION_SEARCH_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cyclePositionSearch(state = [], action) {
  switch (action.type) {
    case 'CYCLE_POSITION_SEARCH_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ Cycle Positions: Get Single Position ================

export function cyclePositionFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITION_FETCH_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function cyclePositionFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITION_FETCH_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cyclePositionFetch(state = [], action) {
  switch (action.type) {
    case 'CYCLE_POSITION_FETCH_SUCCESS':
      return action.data;
    default:
      return state;
  }
}

// ================ Cycle Positions: Edit Position ================

export function cyclePositionEditSuccess(state = false, action) {
  switch (action.type) {
    case 'CYCLE_POSITION_EDIT_SUCCESS':
      return action.success;
    default:
      return state;
  }
}
