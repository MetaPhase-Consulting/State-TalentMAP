// ================ GET NOTE CABLE ================

export function noteCableFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'NOTE_CABLE_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function noteCableFetchDataLoading(state = true, action) {
  switch (action.type) {
    case 'NOTE_CABLE_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function noteCableFetchData(state = [], action) {
  switch (action.type) {
    case 'NOTE_CABLE_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ GET CABLE ================

export function cableFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'CABLE_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function cableFetchDataLoading(state = true, action) {
  switch (action.type) {
    case 'CABLE_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function cableFetchData(state = [], action) {
  switch (action.type) {
    case 'CABLE_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}

// ================ GET NOTE CABLE REF ================

export function noteCableRefFetchDataErrored(state = false, action) {
  switch (action.type) {
    case 'NOTE_CABLE_REF_FETCH_ERRORED':
      return action.hasErrored;
    default:
      return state;
  }
}
export function noteCableRefFetchDataLoading(state = true, action) {
  switch (action.type) {
    case 'NOTE_CABLE_REF_FETCH_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}
export function noteCableRefFetchData(state = [], action) {
  switch (action.type) {
    case 'NOTE_CABLE_REF_FETCH_SUCCESS':
      return action.results;
    default:
      return state;
  }
}
