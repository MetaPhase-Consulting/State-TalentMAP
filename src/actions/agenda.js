import { downloadFromResponse, formatDate } from 'utilities';
import api from '../api';

// eslint-disable-next-line import/prefer-default-export
export function agendaItemHistoryExport() {
  return api()
    .get('/fsbid/agenda/agenda_items/4/export/')
    .then((response) => {
      downloadFromResponse(response, `Agenda_Item_History_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}

