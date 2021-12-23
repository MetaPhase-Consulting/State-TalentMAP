import { downloadFromResponse, formatDate } from 'utilities';
import api from '../api';

// eslint-disable-next-line import/prefer-default-export
export function agendaItemHistoryExport(cdo, isSort = 'Position_Title') {
  console.log('agendatitemhisty action');
  return api()
    .get(`/fsbid/agenda_items/export/?ordering=${isSort}`)
    .then((response) => {
      downloadFromResponse(response, `Agenda_Item_History_${formatDate(new Date().getTime(), 'YYYY_M_D_Hms')}`);
    });
}

