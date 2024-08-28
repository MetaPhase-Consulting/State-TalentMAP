import { batch } from 'react-redux';
import { get } from 'lodash';
import { convertQueryToString, downloadFromResponse, formatDate } from 'utilities';
import api from '../api';
import { meetingCategoryMap } from '../Components/Panel/Constants';

export function panelMeetingAgendasFetchDataErrored(bool) {
  return {
    type: 'PANEL_MEETING_AGENDAS_FETCH_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function panelMeetingAgendasFetchDataLoading(bool) {
  return {
    type: 'PANEL_MEETING_AGENDAS_FETCH_IS_LOADING',
    isLoading: bool,
  };
}

export function panelMeetingAgendasFetchDataSuccess(results) {
  return {
    type: 'PANEL_MEETING_AGENDAS_FETCH_SUCCESS',
    results,
  };
}

export function panelMeetingAgendasExport(pmseqnum = '') {
  const ep = `/fsbid/panel/${pmseqnum}/agendas/export/`;
  return api()
    .get(ep)
    .then((response) => {
      downloadFromResponse(response, `Panel_Meeting_Agendas_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}

export function panelMeetingAgendasFetchData(query = {}, panelMeetings = []) {
  return (dispatch) => {
    batch(() => {
      dispatch(panelMeetingAgendasFetchDataLoading(true));
      dispatch(panelMeetingAgendasFetchDataErrored(false));
    });
    const q = convertQueryToString(query);
    const endpoint = '/fsbid/agenda/agenda_items/';
    const ep = `${endpoint}?${q}`;
    dispatch(panelMeetingAgendasFetchDataLoading(true));
    api().get(ep)
      .then(({ data }) => {
        const agendas = data.results.results;
        const agendasByPanelMeeting = panelMeetings.map((pm) => {
          // Filter agendas by panel meeting sequence number
          const filteredAgendas = agendas.filter((agenda) => agenda.pmi_pm_seq_num === pm.pmi_pm_seq_num);

          // Initialize an empty object with keys from meetingCategoryMap
          const categorizedAgendas = Object.keys(meetingCategoryMap).reduce((acc, key) => {
            acc[meetingCategoryMap[key]] = [];
            return acc;
          }, {});

          // Iterate over filteredAgendas and categorize them
          filteredAgendas.forEach((agenda) => {
            const category = meetingCategoryMap[agenda.pmi_mic_code];
            if (category) {
              categorizedAgendas[category].push(agenda);
            }
          });

          return {
            ...pm,
            agendas: categorizedAgendas,
          };
        });

        batch(() => {
          dispatch(panelMeetingAgendasFetchDataSuccess(agendasByPanelMeeting));
          dispatch(panelMeetingAgendasFetchDataErrored(false));
          dispatch(panelMeetingAgendasFetchDataLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(panelMeetingAgendasFetchDataErrored(false));
            dispatch(panelMeetingAgendasFetchDataLoading(true));
          });
        } else {
          batch(() => {
            dispatch(panelMeetingAgendasFetchDataSuccess([]));
            dispatch(panelMeetingAgendasFetchDataErrored(true));
            dispatch(panelMeetingAgendasFetchDataLoading(false));
          });
        }
      });
  };
}

export function panelMeetingAgendasSelectionsSaveSuccess(result) {
  return {
    type: 'PANEL_MEETING_AGENDAS_SELECTIONS_SAVE_SUCCESS',
    result,
  };
}

export function savePanelMeetingAgendasSelections(queryObject) {
  return (dispatch) => dispatch(panelMeetingAgendasSelectionsSaveSuccess(queryObject));
}
