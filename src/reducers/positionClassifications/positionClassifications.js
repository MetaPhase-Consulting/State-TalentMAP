// ========== POSITION CLASSIFICATIONS FETCH ==========

export function positionClassificationsIsLoading(state = false, action) {
  switch (action.type) {
    case 'POSITION_CLASSIFICATIONS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}

export function positionClassifications(state = [], action) {
  switch (action.type) {
    case 'POSITION_CLASSIFICATIONS_FETCH_DATA_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

export function positionClassificationsNumber(state = [], action) {
  switch (action.type) {
    case 'POSITION_CLASSIFICATIONS_NUMBER_CHECK':
      return action.currentNumber;
    default:
      return state;
  }
}
