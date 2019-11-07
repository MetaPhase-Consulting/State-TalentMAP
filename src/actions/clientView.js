import api from '../api';
import { toastSuccess, toastError } from './toast';
import { clientBidListFetchData } from './bidList';
import { SET_CLIENT_SUCCESS, GET_CLIENT_SUCCESS_MESSAGE, SET_CLIENT_ERROR,
  UNSET_CLIENT_SUCCESS, UNSET_CLIENT_SUCCESS_MESSAGE } from '../Constants/SystemMessages';

export function setClientViewAs({ loadingId, client, isLoading, hasErrored }) {
  return {
    type: 'SET_CLIENT_VIEW_AS',
    config: {
      loadingId,
      client,
      isLoading,
      hasErrored,
    },
  };
}

export function unsetClientView() {
  return {
    type: 'UNSET_CLIENT_VIEW',
  };
}

export function setClient(id) {
  return (dispatch) => {
    dispatch(setClientViewAs({ client: {}, isLoading: true, hasErrored: false }));
    api().get(`/client/${id}/`)
      .then(({ data }) => {
        dispatch(setClientViewAs({ client: data, isLoading: false, hasErrored: false }));
        dispatch(clientBidListFetchData());
        dispatch(toastSuccess(GET_CLIENT_SUCCESS_MESSAGE(data.user), SET_CLIENT_SUCCESS));
      })
      .catch(() => {
        dispatch(setClientViewAs({ client: {}, isLoading: false, hasErrored: true }));
        dispatch(toastError('Please try again.', SET_CLIENT_ERROR));
      });
  };
}

export function unsetClient() {
  return (dispatch) => {
    dispatch(unsetClientView());
    dispatch(toastSuccess(UNSET_CLIENT_SUCCESS_MESSAGE, UNSET_CLIENT_SUCCESS));
  };
}
