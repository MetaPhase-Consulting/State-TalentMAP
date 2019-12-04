import axios from 'axios';
import { get } from 'lodash';
import api from '../api';

export function userProfilePublicHasErrored(bool) {
  return {
    type: 'USER_PROFILE_PUBLIC_HAS_ERRORED',
    hasErrored: bool,
  };
}

export function userProfilePublicIsLoading(bool) {
  return {
    type: 'USER_PROFILE_PUBLIC_IS_LOADING',
    isLoading: bool,
  };
}

export function userProfilePublicFetchDataSuccess(userProfile) {
  return {
    type: 'USER_PROFILE_PUBLIC_FETCH_DATA_SUCCESS',
    userProfile,
  };
}

export function unsetUserProfilePublic() {
  return (dispatch) => {
    dispatch(userProfilePublicFetchDataSuccess({}));
  };
}

// include an optional bypass for when we want to silently update the profile
export function userProfilePublicFetchData(id, bypass) {
  return (dispatch) => {
    if (!bypass) {
      dispatch(userProfilePublicIsLoading(true));
      dispatch(userProfilePublicHasErrored(false));
    }

    /**
     * create functions to fetch user's profile and other data
     */
    // profile
    const getUserAccount = () => api().get('/fsbid/client/');

    // bids
    const getUserBids = () => api().get(`fsbid/cdo/client/${id}/`); // TODO use fsbid

    // use api' Promise.all to fetch the profile, assignments and any other requests we
    // might add in the future
    axios.all([getUserAccount(), getUserBids()])
      .then(axios.spread((acct, bids) => {
        // form the userProfile object
        const acct$ = get(acct, 'data', []).find(f => `${f.perdet_seq_number}` === id) || {};
        if (!get(acct$, 'perdet_seq_number')) {
          dispatch(userProfilePublicHasErrored(true));
          dispatch(userProfilePublicIsLoading(false));
        } else {
          const newProfileObject = {
            ...acct$,
            user: {
              username: acct$.employee_id,
              email: null,
              first_name: acct$.name,
              last_name: null,
            },
            assignments: [],
            bidList: get(bids, 'data.results', []),
            // any other profile info we want to add in the future
          };

          // then perform dispatches
          dispatch(userProfilePublicFetchDataSuccess(newProfileObject));
          dispatch(userProfilePublicIsLoading(false));
          dispatch(userProfilePublicHasErrored(false));
        }
      }))
      .catch(() => {
        dispatch(userProfilePublicHasErrored(true));
        dispatch(userProfilePublicIsLoading(false));
      });
  };
}
