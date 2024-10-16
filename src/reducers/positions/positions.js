export function positionsHasErrored(state = false, action) {
  switch (action.type) {
    case 'POSITIONS_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function frequentPositionsHasErrored(state = false, action) {
  switch (action.type) {
    case 'FREQUENT_POSITIONS_HAS_ERRORED':
      return action.hasErroredFP;
    default:
      return state;
  }
}
export function positionsIsLoading(state = false, action) {
  switch (action.type) {
    case 'POSITIONS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function frequentPositionsIsLoading(state = false, action) {
  switch (action.type) {
    case 'FREQUENT_POSITIONS_IS_LOADING':
      return action.isLoadingFP;
    default:
      return state;
  }
}
export function positions(state = {}, action) {
  switch (action.type) {
    case 'POSITIONS_SUCCESS':
      return action.data;
    default:
      return state;
  }
}
