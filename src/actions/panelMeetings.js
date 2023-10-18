import { batch } from 'react-redux';
import { get } from 'lodash';
import { CancelToken } from 'axios';
import { convertQueryToString, downloadFromResponse, formatDate } from 'utilities';
import Q from 'q';
import api from '../api';

let cancelPanelMeetings;
let cancelRunPanel;

// ======================== Panel Meeting List ========================

export function panelMeetingsFetchDataErrored(bool) {
  return {
    type: 'PANEL_MEETINGS_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function panelMeetingsFetchDataLoading(bool) {
  return {
    type: 'PANEL_MEETINGS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function panelMeetingsFetchDataSuccess(results) {
  return {
    type: 'PANEL_MEETINGS_FETCH_SUCCESS',
    results,
  };
}

export function panelMeetingsFetchData(query = {}) {
  return (dispatch) => {
    if (cancelPanelMeetings) { cancelPanelMeetings('cancel'); }
    batch(() => {
      dispatch(panelMeetingsFetchDataLoading(true));
      dispatch(panelMeetingsFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/panel/meetings/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => {
        cancelPanelMeetings = c;
      }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(panelMeetingsFetchDataSuccess(data));
          dispatch(panelMeetingsFetchDataErrored(false));
          dispatch(panelMeetingsFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(panelMeetingsFetchDataErrored(false));
            dispatch(panelMeetingsFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(panelMeetingsFetchDataErrored(true));
            dispatch(panelMeetingsFetchDataLoading(false));
          });
        }
      });
  };
}


// ======================== Panel Meeting Filters ========================

export function panelMeetingsFiltersFetchDataErrored(bool) {
  return {
    type: 'PANEL_MEETINGS_FILTERS_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function panelMeetingsFiltersFetchDataLoading(bool) {
  return {
    type: 'PANEL_MEETINGS_FILTERS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function panelMeetingsFiltersFetchDataSuccess(results) {
  return {
    type: 'PANEL_MEETINGS_FILTERS_FETCH_SUCCESS',
    results,
  };
}

export function panelMeetingsFiltersFetchData() {
  return (dispatch) => {
    batch(() => {
      dispatch(panelMeetingsFiltersFetchDataLoading(true));
      dispatch(panelMeetingsFiltersFetchDataErrored(false));
    });
    const EPs = [
      // '/fsbid/panel/reference/categories/',
      // '/fsbid/panel/reference/dates/',
      '/fsbid/panel/reference/statuses/',
      '/fsbid/panel/reference/types/',
    ];
    const queryProms = EPs.map(url =>
      api().get(url)
        .then((r) => r)
        .catch((e) => e),
    );
    Q.allSettled(queryProms)
      .then((results) => {
        const refFilters = { /* panelCategories: [],
          panelDates: [], */
          panelStatuses: [],
          panelTypes: [],
        };

        let errCount = 0;

        results.forEach((p, i) => {
          const refFiltersKeys = Object.keys(refFilters);
          // handle Promise errors
          if (p.value.response || p.reason) {
            errCount += 1;
            refFilters[refFiltersKeys[i]] = [];
          } else {
            refFilters[refFiltersKeys[i]] = get(p, 'value.data.results') || [];
          }
        });

        // if more than half of the calls fail, then fail filters
        if (errCount > Math.floor(EPs.length / 2)) {
          batch(() => {
            dispatch(panelMeetingsFiltersFetchDataErrored(true));
            dispatch(panelMeetingsFiltersFetchDataLoading(false));
          });
        } else {
          batch(() => {
            dispatch(panelMeetingsFiltersFetchDataSuccess(refFilters));
            dispatch(panelMeetingsFiltersFetchDataErrored(false));
            dispatch(panelMeetingsFiltersFetchDataLoading(false));
          });
        }
      })
      .catch(() => {
        batch(() => {
          dispatch(panelMeetingsFiltersFetchDataErrored(true));
          dispatch(panelMeetingsFiltersFetchDataLoading(false));
        });
      });
  };
}


// ======================== Panel Meeting Export ========================

export function panelMeetingsExport(query = {}) {
  const q = convertQueryToString(query);
  const endpoint = '/fsbid/panel/meetings/export/';
  const ep = `${endpoint}?${q}`;
  return api()
    .get(ep)
    .then((response) => {
      downloadFromResponse(response, `Panel_Meetings_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}

// ======================== Panel Meeting Selections ========================

export function panelMeetingsSelectionsSaveSuccess(result) {
  return {
    type: 'PANEL_MEETINGS_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}

export function savePanelMeetingsSelections(queryObject) {
  return (dispatch) => dispatch(panelMeetingsSelectionsSaveSuccess(queryObject));
}

// ======================== Panel Meeting ========================

export function panelMeetingFetchDataErrored(bool) {
  return {
    type: 'PANEL_MEETING_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function panelMeetingFetchDataLoading(bool) {
  return {
    type: 'PANEL_MEETING_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function panelMeetingFetchDataSuccess(results) {
  return {
    type: 'PANEL_MEETING_FETCH_SUCCESS',
    results,
  };
}

export function panelMeetingFetchData(id) {
  return (dispatch) => {
    if (cancelPanelMeetings) {
      cancelPanelMeetings('cancel');
      dispatch(panelMeetingsFetchDataLoading(true));
    }
    batch(() => {
      dispatch(panelMeetingsFetchDataLoading(true));
      dispatch(panelMeetingsFetchDataErrored(false));
    });
    const ep = `/fsbid/admin/panel/${id}/`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => { cancelPanelMeetings = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(panelMeetingsFetchDataSuccess(data));
          dispatch(panelMeetingsFetchDataErrored(false));
          dispatch(panelMeetingsFetchDataLoading(false));
        });
      })
      .catch(() => {
        batch(() => {
          dispatch(panelMeetingsFetchDataErrored(true));
          dispatch(panelMeetingsFetchDataLoading(false));
        });
      });
  };
}

// ======================== Panel Meeting Actions ========================

export function runOfficialPreliminarySuccess(result) {
  return {
    type: 'RUN_OFFICIAL_PRELIMINARY_SUCCESS',
    result,
  };
}

export function runOfficialPreliminaryErrored(bool) {
  return {
    type: 'RUN_OFFICIAL_PRELIMINARY_ERRORED',
    hasErrored: bool,
  };
}

export function runOfficialAddendumSuccess(result) {
  return {
    type: 'RUN_OFFICIAL_ADDENDUM_SUCCESS',
    result,
  };
}

export function runOfficialAddendumErrored(bool) {
  return {
    type: 'RUN_OFFICIAL_ADDENDUM_ERRORED',
    hasErrored: bool,
  };
}

export function runPostPanelProcessingSuccess(result) {
  return {
    type: 'RUN_POST_PANEL_PROCESSING_SUCCESS',
    result,
  };
}

export function runPostPanelProcessingErrored(bool) {
  return {
    type: 'RUN_POST_PANEL_PROCESSING_ERRORED',
    hasErrored: bool,
  };
}

export function runPanelMeeting(id, type) {
  let success = runPostPanelProcessingSuccess;
  let errored = runPostPanelProcessingErrored;
  if (type === 'preliminary') {
    success = runOfficialPreliminarySuccess;
    errored = runOfficialPreliminaryErrored;
  }
  if (type === 'addendum') {
    success = runPostPanelProcessingSuccess;
    errored = runPostPanelProcessingErrored;
  }
  return (dispatch) => {
    if (cancelRunPanel) {
      cancelRunPanel('cancel');
    }
    batch(() => {
      dispatch(errored(false));
    });
    const ep = `/fsbid/admin/panel/run/${type}/${id}/`;
    api().put(ep, {
      cancelToken: new CancelToken((c) => { cancelRunPanel = c; }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(success(data));
          dispatch(errored(false));
        });
      })
      .catch(() => {
        dispatch(errored(true));
      });
  };
}
