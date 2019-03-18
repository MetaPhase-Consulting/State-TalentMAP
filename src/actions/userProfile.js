import axios from 'axios';
import { indexOf } from 'lodash';

import api from '../api';
import { favoritePositionsFetchData } from './favoritePositions';
import { toastSuccess, toastError } from './toast';
import * as SystemMessages from '../Constants/SystemMessages';

export function userProfileHasErrored(bool) {
  return {
    type: 'USER_PROFILE_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function userProfileIsLoading(bool) {
  return {
    type: 'USER_PROFILE_IS_LOADING',
    isLoading: bool,
  };
}

export function userProfileFetchDataSuccess(userProfile) {
  return {
    type: 'USER_PROFILE_FETCH_DATA_SUCCESS',
    userProfile,
  };
}

// when adding or removing a favorite
export function userProfileFavoritePositionIsLoading(bool) {
  return {
    type: 'USER_PROFILE_FAVORITE_POSITION_IS_LOADING',
    userProfileFavoritePositionIsLoading: bool,
  };
}

// when adding or removing a favorite has errored
export function userProfileFavoritePositionHasErrored(bool) {
  return {
    type: 'USER_PROFILE_FAVORITE_POSITION_HAS_ERRORED',
    userProfileFavoritePositionHasErrored: bool,
  };
}

export function unsetUserProfile() {
  return (dispatch) => {
    dispatch(userProfileFetchDataSuccess({}));
  };
}

// include an optional bypass for when we want to silently update the profile
export function userProfileFetchData(bypass) {
  return (dispatch) => {
    if (!bypass) {
      dispatch(userProfileIsLoading(true));
      dispatch(userProfileHasErrored(false));
    }

    /**
     * create functions to fetch user's profile and permissions
     */
    // profile
    const getUserAccount = () => api.get('/profile/');
    // permissions
    const getUserPermissions = () => api.get('/permission/user/');

    // use api' Promise.all to fetch the profile and permissions, and then combine them
    // into one object
    axios.all([getUserAccount(), getUserPermissions()])
      .then(axios.spread((acct, perms) => {
        // form the userProfile object
        const account = acct.data;
        const permissions = perms.data;
        const newProfileObject = {
          ...account,
          is_superuser: indexOf(permissions.groups, 'superuser') > -1,
          permission_groups: permissions.groups,
        };

        // then perform dispatches
        dispatch(userProfileFetchDataSuccess(newProfileObject));
        dispatch(userProfileIsLoading(false));
        dispatch(userProfileHasErrored(false));
        dispatch(userProfileFavoritePositionHasErrored(false));
        dispatch(userProfileFavoritePositionIsLoading(false));
      }))
      .catch(() => {
        dispatch(userProfileHasErrored(true));
        dispatch(userProfileIsLoading(false));
        dispatch(userProfileFavoritePositionIsLoading(false));
      });
  };
}

// Toggling a favorite position:
// We want to be explicit by having a "remove" param,
// so that the visual indicator for the user's action always aligns
// what we're actually doing.
// We also want to refresh their favorites, in case they made changes on another page.
// Since we have to pass the entire array to the API, we want to make sure it's accurate.
// If we need a full refresh of Favorite Positions, such as for the profile's favorite sub-section,
// we can pass a third arg, refreshFavorites.
export function userProfileToggleFavoritePosition(id, remove, refreshFavorites = false) {
  const idString = id.toString();
  return (dispatch) => {
    const config = {
      method: remove ? 'delete' : 'put',
      url: `/position/${idString}/favorite/`,
    };

    /**
     * create functions for creating the action and fetching position data to supply to message
     */
    // action
    const getAction = () => api(config);

    // position
    const getPosition = () => api.get(`/position/${id}/`);

    dispatch(userProfileFavoritePositionIsLoading(true));
    dispatch(userProfileFavoritePositionHasErrored(false));

    axios.all([getAction(), getPosition()])
      .then(axios.spread((action, position) => {
        const pos = position.data;
        const message = remove ?
          SystemMessages.DELETE_FAVORITE_SUCCESS(pos) : SystemMessages.ADD_FAVORITE_SUCCESS(pos);
        const title = remove ? SystemMessages.DELETE_FAVORITE_TITLE
          : SystemMessages.ADD_FAVORITE_TITLE;
        dispatch(userProfileFetchData(true));
        dispatch(userProfileFavoritePositionIsLoading(false));
        dispatch(userProfileFavoritePositionHasErrored(false));
        dispatch(toastSuccess(message, title));
        if (refreshFavorites) {
          dispatch(favoritePositionsFetchData());
        }
      }))
      .catch(() => {
        const message = remove ?
          SystemMessages.DELETE_FAVORITE_ERROR() : SystemMessages.ADD_FAVORITE_ERROR();
        const title = SystemMessages.ERROR_FAVORITE_TITLE;
        dispatch(userProfileFavoritePositionIsLoading(false));
        dispatch(userProfileFavoritePositionHasErrored(true));
        dispatch(toastError(message, title));
      });
  };
}
