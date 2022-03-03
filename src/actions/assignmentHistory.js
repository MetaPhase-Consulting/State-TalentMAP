import api from '../api';


// eslint-disable-next-line import/prefer-default-export
export const fetchClientAssignmentHistory = perdet =>
  api().get(`/fsbid/assignment_history/${perdet}/`)
    .then(({ data }) => data)
    .then(client => client)
    .catch(error => error);
