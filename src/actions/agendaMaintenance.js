import { batch } from 'react-redux';
import { get } from 'lodash';
import api from '../api';

export function agendaItemSaveErrored(bool) {
  return {
    type: 'AGENDA_ITEM_SAVE_ERRORED',
    hasErrored: bool,
  };
}

export function agendaItemSaveLoading(bool) {
  return {
    type: 'AGENDA_ITEM_SAVE_LOADING',
    isLoading: bool,
  };
}

export function agendaItemSaveSuccess(results) {
  return {
    type: 'AGENDA_ITEM_SAVE_SUCCESS',
    results,
  };
}

export function saveAgendaItem(ai_data = {}) {
  // eslint-disable-next-line no-console
  console.log('current: ai_data', ai_data);
  return (dispatch) => {
    batch(() => {
      dispatch(agendaItemSaveLoading(true));
      dispatch(agendaItemSaveErrored(false));
    });
    api().post('/fsbid/save_ai/')
      .then(({ data }) => {
        batch(() => {
          dispatch(agendaItemSaveSuccess(data));
          dispatch(agendaItemSaveErrored(false));
          dispatch(agendaItemSaveLoading(false));
        });
      })
      .catch((err) => {
        if (get(err, 'message') === 'cancel') {
          batch(() => {
            dispatch(agendaItemSaveErrored(false));
            dispatch(agendaItemSaveLoading(true));
          });
        } else {
          batch(() => {
            dispatch(agendaItemSaveSuccess([]));
            dispatch(agendaItemSaveErrored(true));
            dispatch(agendaItemSaveLoading(false));
          });
        }
      });
  };
}
