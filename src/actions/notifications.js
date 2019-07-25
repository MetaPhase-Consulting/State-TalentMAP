import Q from 'q';
import api from '../api';
import { hasValidToken } from '../utilities';

export function notificationsHasErrored(bool) {
  return {
    type: 'NOTIFICATIONS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function notificationsIsLoading(bool) {
  return {
    type: 'NOTIFICATIONS_IS_LOADING',
    isLoading: bool,
  };
}
export function notificationsFetchDataSuccess(notifications) {
  return {
    type: 'NOTIFICATIONS_FETCH_DATA_SUCCESS',
    notifications,
  };
}

export function notificationsCountHasErrored(bool) {
  return {
    type: 'NOTIFICATIONS_COUNT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function notificationsCountIsLoading(bool) {
  return {
    type: 'NOTIFICATIONS_COUNT_IS_LOADING',
    isLoading: bool,
  };
}
export function notificationsCountFetchDataSuccess(count) {
  return {
    type: 'NOTIFICATIONS_COUNT_FETCH_DATA_SUCCESS',
    count,
  };
}

export function markNotificationHasErrored(bool) {
  return {
    type: 'MARK_NOTIFICATION_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function markNotificationIsLoading(bool) {
  return {
    type: 'MARK_NOTIFICATION_IS_LOADING',
    isLoading: bool,
  };
}
export function markNotificationSuccess(response) {
  return {
    type: 'MARK_NOTIFICATION_SUCCESS',
    response,
  };
}

export function markNotificationsHasErrored(bool) {
  return {
    type: 'MARK_NOTIFICATIONS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function markNotificationsIsLoading(bool) {
  return {
    type: 'MARK_NOTIFICATIONS_IS_LOADING',
    isLoading: bool,
  };
}
export function markNotificationsSuccess(response) {
  return {
    type: 'MARK_NOTIFICATIONS_SUCCESS',
    response,
  };
}

export function unsetNotificationsCount() {
  return (dispatch) => {
    dispatch(notificationsCountFetchDataSuccess(0));
  };
}

export function notificationsCountFetchData() {
  return (dispatch) => {
    if (hasValidToken()) {
      api().get('/notification/?limit=1&is_read=false')
        .then(({ data }) => {
          dispatch(notificationsCountFetchDataSuccess(data.count));
          dispatch(notificationsCountIsLoading(false));
          dispatch(notificationsCountHasErrored(false));
        })
        .catch(() => {
          dispatch(notificationsCountHasErrored(true));
          dispatch(notificationsCountIsLoading(false));
        });
    } else {
      dispatch(notificationsCountHasErrored(true));
      dispatch(notificationsCountIsLoading(false));
    }
  };
}

export function notificationsFetchData(limit = 3, page = 1, ordering = '-date_created', tags = undefined, isRead = undefined) {
  return (dispatch) => {
    dispatch(notificationsIsLoading(true));
    dispatch(notificationsHasErrored(false));
    api().get(`/notification/?limit=${limit}&page=${page}&ordering=${ordering}${tags !== undefined ? `&tags=${tags}` : ''}${isRead !== undefined ? `&is_read=${isRead}` : ''}`)
      .then(({ data }) => {
        dispatch(notificationsFetchDataSuccess(data));
        dispatch(notificationsHasErrored(false));
        dispatch(notificationsIsLoading(false));
      })
      .catch(() => {
        dispatch(notificationsHasErrored(true));
        dispatch(notificationsIsLoading(false));
      });
  };
}

export function bidTrackerNotificationsFetchData() {
  return (dispatch) => {
    dispatch(notificationsFetchData(1, 1, '-date_created', 'bidding'));
  };
}

export function markNotification(id, isRead = true, shouldDelete = false,
  bypassTrackerUpdate = false, cb = () => {}) {
  return (dispatch) => {
    dispatch(markNotificationIsLoading(true));
    dispatch(markNotificationHasErrored(false));
    const method = shouldDelete ? 'delete' : 'patch';
    const body = shouldDelete ? {} : { is_read: isRead };
    api()[method](`/notification/${id}/`, body)
      .then(({ data }) => {
        cb();
        setTimeout(() => {
          dispatch(notificationsCountFetchData());
          dispatch(markNotificationSuccess(data));
          dispatch(markNotificationHasErrored(false));
          dispatch(markNotificationIsLoading(false));
          if (!bypassTrackerUpdate) {
            dispatch(bidTrackerNotificationsFetchData());
          }
        }, 0);
      })
      .catch(() => {
        dispatch(markNotificationHasErrored(true));
        dispatch(markNotificationIsLoading(false));
      });
  };
}

export function markNotifications({ ids = new Set(), markAsRead = false, shouldDelete = false,
  cb = () => {} }) {
  return (dispatch) => {
    dispatch(markNotificationsIsLoading(true));
    dispatch(markNotificationsHasErrored(false));
    dispatch(markNotificationsSuccess(false));
    const method = shouldDelete ? 'delete' : 'patch';
    const body = shouldDelete ? {} : { is_read: markAsRead };

    const queryProms = [...ids].map(id => (
      api()[method](`/notification/${id}/`, body)
        .then(() => ({ success: true, id }))
        .catch(() => ({ success: false, id }))
    ));

    Q.allSettled(queryProms)
    .then(() => {
      cb();
      setTimeout(() => {
        dispatch(notificationsCountFetchData());
        dispatch(markNotificationsSuccess(true));
        dispatch(markNotificationsHasErrored(false));
        dispatch(markNotificationsIsLoading(false));
      }, 0);
    });
  };
}
