// ================ BIDDING TOOL ================

export function biddingToolFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOL_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function biddingToolFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOL_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function biddingTool(state = [], action) {
  switch (action.type) {
    case 'BIDDING_TOOL_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ BIDDING TOOL LIST ================

export function biddingToolsFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOLS_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function biddingToolsFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOLS_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function biddingTools(state = [], action) {
  switch (action.type) {
    case 'BIDDING_TOOLS_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ BIDDING TOOL CREATE DATA ================

export function biddingToolCreateDataErrored(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOL_CREATE_DATA_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function biddingToolCreateDataLoading(state = false, action) {
  switch (action.type) {
    case 'BIDDING_TOOL_CREATE_DATA_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function biddingToolCreateDataSuccess(state = [], action) {
  switch (action.type) {
    case 'BIDDING_TOOL_CREATE_DATA_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
