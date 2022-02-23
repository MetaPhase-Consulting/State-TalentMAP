
import { batch } from 'react-redux';
import { get, identity, isArray, isString, pickBy } from 'lodash';
import { stringify } from 'query-string';
import { CancelToken } from 'axios';
import { downloadFromResponse, formatDate } from 'utilities';
import Q from 'q';
import api from '../api';

let cancelAgendaEmployees;

export function agendaEmployeesFetchDataErrored(bool) {
  return {
    type: 'AGENDA_EMPLOYEES_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function agendaEmployeesFetchDataLoading(bool) {
  return {
    type: 'AGENDA_EMPLOYEES_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function agendaEmployeesFetchDataSuccess(results) {
  return {
    type: 'AGENDA_EMPLOYEES_FETCH_SUCCESS',
    results,
  };
}

export function agendaEmployeesFiltersFetchDataErrored(bool) {
  return {
    type: 'AGENDA_EMPLOYEES_FILTERS_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function agendaEmployeesFiltersFetchDataLoading(bool) {
  return {
    type: 'AGENDA_EMPLOYEES_FILTERS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function agendaEmployeesFiltersFetchDataSuccess(results) {
  return {
    type: 'AGENDA_EMPLOYEES_FILTERS_FETCH_SUCCESS',
    results,
  };
}

const convertQueryToString = query => {
  let q = pickBy(query, identity);
  Object.keys(q).forEach(queryk => {
    if (isArray(q[queryk])) { q[queryk] = q[queryk].join(); }
    if (isString(q[queryk]) && !q[queryk]) {
      q[queryk] = undefined;
    }
  });
  q = stringify(q);
  return q;
};

export function agendaItemHistoryExport(query = {}) {
  const q = convertQueryToString(query);
  const endpoint = '/fsbid/agenda_employees/export/';
  const ep = `${endpoint}?${q}`;
  return api()
    .get(ep)
    .then((response) => {
      downloadFromResponse(response, `Agenda_Item_Employees_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}

export function agendaEmployeesFetchData(query = {}) {
  return (dispatch) => {
    if (cancelAgendaEmployees) { cancelAgendaEmployees('cancel'); }
    batch(() => {
      dispatch(agendaEmployeesFetchDataLoading(true));
      dispatch(agendaEmployeesFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/agenda_employees/';
    const ep = `${endpoint}?${q}`;
    api().get(ep, {
      cancelToken: new CancelToken((c) => {
        cancelAgendaEmployees = c;
      }),
    })
      .then(({ data }) => {
        batch(() => {
          dispatch(agendaEmployeesFetchDataSuccess(data));
          dispatch(agendaEmployeesFetchDataErrored(false));
          dispatch(agendaEmployeesFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(agendaEmployeesFetchDataErrored(false));
            dispatch(agendaEmployeesFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(agendaEmployeesFetchDataSuccess([]));
            dispatch(agendaEmployeesFetchDataErrored(true));
            dispatch(agendaEmployeesFetchDataLoading(false));
          });
        }
      });
  };
}

export function agendaEmployeesSelectionsSaveSuccess(result) {
  return {
    type: 'AGENDA_EMPLOYEES_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}

export function saveAgendaEmployeesSelections(queryObject) {
  return (dispatch) => dispatch(agendaEmployeesSelectionsSaveSuccess(queryObject));
}

export function agendaEmployeesFiltersFetchData() {
  return (dispatch) => {
    batch(() => {
      dispatch(agendaEmployeesFiltersFetchDataLoading(true));
      dispatch(agendaEmployeesFiltersFetchDataErrored(false));
    });
    const ep = [
      '/fsbid/agenda_employees/reference/current-bureaus/',
      '/fsbid/agenda_employees/reference/handshake-bureaus/',
      '/fsbid/agenda_employees/reference/current-organizations/',
      '/fsbid/agenda_employees/reference/handshake-organizations/',
    ];
    const queryProms = ep.map(url =>
      api().get(url)
        .then((r) => r)
        .catch((e) => e),
    );
    Q.allSettled(queryProms)
      .then((results) => {
        const successCount = results.filter(r => r.state === 'fulfilled' && r.value).length || 0;
        const queryPromsLen = queryProms.length || 0;
        const countDiff = queryPromsLen - successCount;
        if (countDiff > 0) {
          batch(() => {
            dispatch(agendaEmployeesFiltersFetchDataErrored(true));
            dispatch(agendaEmployeesFiltersFetchDataLoading(false));
          });
        } else {
          const currentBureaus = get(results, '[0].value.data', []);
          const handshakeBureaus = get(results, '[1].value.data', []);
          const currentOrganizations = get(results, '[2].value.data', []);
          const handshakeOrganizations = get(results, '[3].value.data', []);
          const filters = {
            currentBureaus, handshakeBureaus, currentOrganizations, handshakeOrganizations,
          };
          batch(() => {
            dispatch(agendaEmployeesFiltersFetchDataSuccess(filters));
            dispatch(agendaEmployeesFiltersFetchDataErrored(false));
            dispatch(agendaEmployeesFiltersFetchDataLoading(false));
          });
        }
      })
      .catch(() => {
        batch(() => {
          dispatch(agendaEmployeesFiltersFetchDataErrored(true));
          dispatch(agendaEmployeesFiltersFetchDataLoading(false));
        });
      });
  };
}
