import { batch } from 'react-redux';
import {
  UPDATE_PANEL_MEETING_ERROR,
  UPDATE_PANEL_MEETING_ERROR_TITLE,
  UPDATE_PANEL_MEETING_SUCCESS,
  UPDATE_PANEL_MEETING_SUCCESS_TITLE,
} from 'Constants/SystemMessages';
import api from '../api';
import { toastError, toastSuccess } from './toast';

export function createPanelMeetingHasErrored(bool) {
  return {
    type: 'CREATE_PANEL_MEETING_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function createPanelMeetingIsLoading(bool) {
  return {
    type: 'CREATE_PANEL_MEETING_IS_LOADING',
    isLoading: bool,
  };
}
export function createPanelMeetingSuccess(data) {
  return {
    type: 'CREATE_PANEL_MEETING_SUCCESS',
    data,
  };
}

// eslint-disable-next-line no-unused-vars
export function createPanelMeeting(props) {
  return (dispatch) => {
    batch(() => {
      dispatch(createPanelMeetingIsLoading(true));
      dispatch(createPanelMeetingHasErrored(false));
      dispatch(createPanelMeetingSuccess([]));
    });

    api().post('/fsbid/panel/meeting/', props)
      .then(({ data }) => {
        batch(() => {
          dispatch(createPanelMeetingHasErrored(false));
          dispatch(createPanelMeetingSuccess(data || []));
          dispatch(toastSuccess(UPDATE_PANEL_MEETING_SUCCESS, UPDATE_PANEL_MEETING_SUCCESS_TITLE));
          dispatch(createPanelMeetingIsLoading(false));
        });
      }).catch(() => {
        dispatch(toastError(UPDATE_PANEL_MEETING_ERROR, UPDATE_PANEL_MEETING_ERROR_TITLE));
        dispatch(createPanelMeetingHasErrored(true));
        dispatch(createPanelMeetingIsLoading(false));
      });
  };
}

export function editPanelMeetingHasErrored(bool) {
  return {
    type: 'EDIT_PANEL_MEETING_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function editPanelMeetingIsLoading(bool) {
  return {
    type: 'EDIT_PANEL_MEETING_IS_LOADING',
    isLoading: bool,
  };
}
export function editPanelMeetingSuccess(data) {
  return {
    type: 'EDIT_PANEL_MEETING_SUCCESS',
    data,
  };
}

// eslint-disable-next-line no-unused-vars
export function editPanelMeeting(props) {
  return (dispatch) => {
    batch(() => {
      dispatch(editPanelMeetingSuccess([]));
      dispatch(editPanelMeetingIsLoading(true));
      dispatch(editPanelMeetingHasErrored(false));
    });

    api().put('/fsbid/panel/meeting/', props)
      .then(({ data }) => {
        batch(() => {
          dispatch(editPanelMeetingHasErrored(false));
          dispatch(editPanelMeetingSuccess(data || []));
          dispatch(toastSuccess(UPDATE_PANEL_MEETING_SUCCESS, UPDATE_PANEL_MEETING_SUCCESS_TITLE));
          dispatch(editPanelMeetingIsLoading(false));
        });
      }).catch(() => {
        dispatch(toastError(UPDATE_PANEL_MEETING_ERROR, UPDATE_PANEL_MEETING_ERROR_TITLE));
        dispatch(editPanelMeetingHasErrored(true));
        dispatch(editPanelMeetingIsLoading(false));
      });
  };
}
