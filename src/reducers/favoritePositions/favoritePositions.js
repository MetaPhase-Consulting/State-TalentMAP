export function favoritePositionsHasErrored(state = false, action) {
  switch (action.type) {
    case 'FAVORITE_POSITIONS_HAS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function favoritePositionsIsLoading(state = false, action) {
  switch (action.type) {
    case 'FAVORITE_POSITIONS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function favoritePositions(state = { favorites: [], favoritesPV: [] }, action) {
  switch (action.type) {
    case 'FAVORITE_POSITIONS_FETCH_DATA_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
export function tempFavoritePositions(state = { favorites: [], favoritesPV: [] }, action) {
  console.log('action:');
  console.log(action);
  switch (action.type) {
    case 'TEMP_FAVORITE_POSITIONS_FETCH_DATA_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
