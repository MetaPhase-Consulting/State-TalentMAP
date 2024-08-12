// ================ GET LIST ================

export function projectedVacancyFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function projectedVacancyFetchDataLoading(state = false, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function projectedVacancy(state = {}, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ EDIT FILTER SELECTIONS ================

export function projectedVacancySelections(state = {}, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_SELECTIONS_SAVE_SUCCESS':
      return action.result;
    default:
      return state;
  }
}

// ================ GET FILTER DATA ================

export function projectedVacancyFiltersErrored(state = false, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FILTERS_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function projectedVacancyFiltersLoading(state = false, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FILTERS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function projectedVacancyFilters(state = {}, action) {
  switch (action.type) {
    case 'PROJECTED_VACANCY_FILTERS_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
