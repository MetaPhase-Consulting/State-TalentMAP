export function shouldShowSearchBar(shouldShow) {
  return {
    type: 'SHOULD_SHOW_SEARCH_BAR',
    shouldShow,
  };
}

export function toggleSearchBar(show = false) {
  return (dispatch) => {
    dispatch(shouldShowSearchBar(show));
  };
}
