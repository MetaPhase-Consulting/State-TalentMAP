import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import { bidListFetchData, toggleBidPosition, routeChangeResetState,
  submitBid, acceptBid, declineBid } from '../../actions/bidList';
import { userProfilePublicFetchData } from '../../actions/userProfilePublic';
import { bidTrackerNotificationsFetchData, markNotification } from '../../actions/notifications';
import { BID_LIST, BID_LIST_TOGGLE_HAS_ERRORED, BID_LIST_TOGGLE_SUCCESS, SUBMIT_BID_HAS_ERRORED,
  SUBMIT_BID_SUCCESS, EMPTY_FUNCTION, ACCEPT_BID_SUCCESS, ACCEPT_BID_HAS_ERRORED, USER_PROFILE,
  DECLINE_BID_SUCCESS, DECLINE_BID_HAS_ERRORED, NOTIFICATION_LIST, MARK_NOTIFICATION_SUCCESS } from '../../Constants/PropTypes';
import { DEFAULT_USER_PROFILE } from '../../Constants/DefaultProps';
import BidTracker from '../../Components/BidTracker';

class BidTrackerContainer extends Component {
  UNSAFE_componentWillMount() {
    const { isPublic, match: { params: { id } } } = this.props;
    if (isPublic) {
      this.getPublicBidList(id);
    } else {
      this.getBidList();
      this.props.fetchNotifications();
    }
    // reset the alert messages
    this.props.bidListRouteChangeResetState();
    this.state = {
      hasScrolled: false,
    };
  }

  componentDidUpdate() {
    const { match: { params } } = this.props;
    if (params.bid) {
      this.scrollToId(params.bid);
    }
  }

  getBidList() {
    this.props.fetchBidList();
  }

  getPublicBidList(id) {
    this.props.fetchUserData(id);
  }

  // Scroll to the bid provided by route id.
  // Only perform once.
  scrollToId(id) {
    const el = document.querySelector(`#bid-${id}`);
    if (el && !this.state.hasScrolled) {
      el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      if (!this.state.hasScrolled) {
        this.setState({ hasScrolled: true });
      }
    }
  }

  render() {
    const { bidList, deleteBid, isPublic,
      bidListHasErrored, bidListIsLoading, bidListToggleHasErrored,
      bidListToggleSuccess, submitBidPosition,
      submitBidHasErrored, submitBidIsLoading, submitBidSuccess,
      acceptBidPosition, acceptBidHasErrored, acceptBidIsLoading, acceptBidSuccess,
      declineBidPosition, declineBidHasErrored, declineBidIsLoading,
      declineBidSuccess, notifications, notificationsIsLoading,
      markNotificationHasErrored, markNotificationIsLoading, markNotificationSuccess,
      markBidTrackerNotification, userProfile, userProfileIsLoading,
      userProfilePublic, userProfilePublicIsLoading, userProfilePublicHasErrored } = this.props;

    const bidList$ = isPublic ? { results: userProfilePublic.bidList } : bidList;
    const bidListHasErrored$ = isPublic ? userProfilePublicHasErrored : bidListHasErrored;
    const bidListIsLoading$ = isPublic ? userProfilePublicIsLoading : bidListIsLoading;
    const userProfile$ = isPublic ? userProfilePublic : userProfile;
    const userProfileIsLoading$ = isPublic ? userProfilePublicIsLoading : userProfileIsLoading;

    const useCDOView = get(userProfile, 'is_cdo') && isPublic && !userProfileIsLoading;

    return (
      <BidTracker
        bidList={bidList$}
        bidListHasErrored={bidListHasErrored$}
        bidListIsLoading={bidListIsLoading$}
        bidListToggleHasErrored={bidListToggleHasErrored}
        bidListToggleSuccess={bidListToggleSuccess}
        deleteBid={deleteBid}
        submitBid={submitBidPosition}
        submitBidHasErrored={submitBidHasErrored}
        submitBidIsLoading={submitBidIsLoading}
        submitBidSuccess={submitBidSuccess}
        acceptBid={acceptBidPosition}
        acceptBidHasErrored={acceptBidHasErrored}
        acceptBidIsLoading={acceptBidIsLoading}
        acceptBidSuccess={acceptBidSuccess}
        declineBid={declineBidPosition}
        declineBidHasErrored={declineBidHasErrored}
        declineBidIsLoading={declineBidIsLoading}
        declineBidSuccess={declineBidSuccess}
        notifications={notifications}
        notificationsIsLoading={notificationsIsLoading}
        markNotificationHasErrored={markNotificationHasErrored}
        markNotificationIsLoading={markNotificationIsLoading}
        markNotificationSuccess={markNotificationSuccess}
        markBidTrackerNotification={markBidTrackerNotification}
        userProfile={userProfile$}
        userProfileIsLoading={userProfileIsLoading$}
        isPublic={isPublic}
        useCDOView={useCDOView}
      />
    );
  }
}

BidTrackerContainer.propTypes = {
  bidListRouteChangeResetState: PropTypes.func.isRequired,
  isPublic: PropTypes.bool,
  fetchBidList: PropTypes.func,
  fetchUserData: PropTypes.func,
  deleteBid: PropTypes.func,
  bidListHasErrored: PropTypes.bool,
  bidListIsLoading: PropTypes.bool,
  bidList: BID_LIST,
  bidListToggleHasErrored: BID_LIST_TOGGLE_HAS_ERRORED,
  bidListToggleSuccess: BID_LIST_TOGGLE_SUCCESS,
  submitBidPosition: PropTypes.func.isRequired,
  submitBidHasErrored: SUBMIT_BID_HAS_ERRORED.isRequired,
  submitBidIsLoading: PropTypes.bool.isRequired,
  submitBidSuccess: SUBMIT_BID_SUCCESS.isRequired,
  acceptBidPosition: PropTypes.func.isRequired,
  acceptBidHasErrored: ACCEPT_BID_HAS_ERRORED.isRequired,
  acceptBidIsLoading: PropTypes.bool.isRequired,
  acceptBidSuccess: ACCEPT_BID_SUCCESS.isRequired,
  declineBidPosition: PropTypes.func.isRequired,
  declineBidHasErrored: DECLINE_BID_HAS_ERRORED.isRequired,
  declineBidIsLoading: PropTypes.bool.isRequired,
  declineBidSuccess: DECLINE_BID_SUCCESS.isRequired,
  notifications: NOTIFICATION_LIST.isRequired,
  notificationsIsLoading: PropTypes.bool.isRequired,
  fetchNotifications: PropTypes.func.isRequired,
  markNotificationHasErrored: PropTypes.bool.isRequired,
  markNotificationIsLoading: PropTypes.bool.isRequired,
  markNotificationSuccess: MARK_NOTIFICATION_SUCCESS,
  markBidTrackerNotification: PropTypes.func.isRequired,
  userProfile: USER_PROFILE.isRequired,
  userProfileIsLoading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
  userProfilePublic: USER_PROFILE,
  userProfilePublicIsLoading: PropTypes.bool,
  userProfilePublicHasErrored: PropTypes.bool,
};

BidTrackerContainer.defaultProps = {
  fetchBidList: EMPTY_FUNCTION,
  isPublic: false,
  fetchUserData: EMPTY_FUNCTION,
  deleteBid: EMPTY_FUNCTION,
  bidList: { results: [] },
  bidListHasErrored: false,
  bidListIsLoading: false,
  bidListToggleHasErrored: false,
  bidListToggleSuccess: false,
  submitBidPosition: EMPTY_FUNCTION,
  submitBidHasErrored: false,
  submitBidIsLoading: false,
  submitBidSuccess: false,
  acceptBidPosition: EMPTY_FUNCTION,
  acceptBidHasErrored: false,
  acceptBidIsLoading: false,
  acceptBidSuccess: false,
  declineBidPosition: EMPTY_FUNCTION,
  declineBidHasErrored: false,
  declineBidIsLoading: false,
  declineBidSuccess: false,
  notificationsIsLoading: false,
  notifications: { results: [] },
  fetchNotifications: EMPTY_FUNCTION,
  markNotificationHasErrored: false,
  markNotificationIsLoading: false,
  markNotificationSuccess: false,
  markBidTrackerNotification: EMPTY_FUNCTION,
  userProfile: DEFAULT_USER_PROFILE,
  userProfileIsLoading: false,
  userProfilePublic: DEFAULT_USER_PROFILE,
  userProfilePublicIsLoading: false,
  userProfilePublicHasErrored: false,
  match: { params: {} },
};

BidTrackerContainer.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = state => ({
  bidListHasErrored: state.bidListHasErrored,
  bidListIsLoading: state.bidListIsLoading,
  bidList: state.bidListFetchDataSuccess,
  bidListToggleHasErrored: state.bidListToggleHasErrored,
  bidListToggleSuccess: state.bidListToggleSuccess,
  submitBidHasErrored: state.submitBidHasErrored,
  submitBidIsLoading: state.submitBidIsLoading,
  submitBidSuccess: state.submitBidSuccess,
  acceptBidHasErrored: state.acceptBidHasErrored,
  acceptBidIsLoading: state.acceptBidIsLoading,
  acceptBidSuccess: state.acceptBidSuccess,
  declineBidHasErrored: state.declineBidHasErrored,
  declineBidIsLoading: state.declineBidIsLoading,
  declineBidSuccess: state.declineBidSuccess,
  notifications: state.notifications,
  notificationsIsLoading: state.notificationsIsLoading,
  markNotificationHasErrored: state.markNotificationHasErrored,
  markNotificationIsLoading: state.markNotificationIsLoading,
  markNotificationSuccess: state.markNotificationSuccess,
  userProfile: state.userProfile,
  userProfileIsLoading: state.userProfileIsLoading,
  userProfilePublic: state.userProfilePublic,
  userProfilePublicIsLoading: state.userProfilePublicIsLoading,
  userProfilePublicHasErrored: state.userProfilePublicHasErrored,
});

export const mapDispatchToProps = (dispatch, ownProps) => {
  const isPublic = get(ownProps, 'isPublic');
  const id$ = get(ownProps, 'match.params.id');
  let config = {
    fetchUserData: id => dispatch(userProfilePublicFetchData(id)),
    fetchBidList: () => dispatch(bidListFetchData()),
    bidListRouteChangeResetState: () => dispatch(routeChangeResetState()),
    // Here, we only want the newest bidding-related notification.
    // We'll perform a client-side check to see if it's unread, as that's would be the only
    // case that we'd display this notification.
    fetchNotifications: () => dispatch(bidTrackerNotificationsFetchData()),
    markBidTrackerNotification: id => dispatch(markNotification(id)),
  };
  // Different configs based on whether this is the public view or not
  if (!isPublic) {
    config = {
      ...config,
      submitBidPosition: id => dispatch(submitBid(id)),
      acceptBidPosition: id => dispatch(acceptBid(id)),
      declineBidPosition: id => dispatch(declineBid(id)),
      deleteBid: id => dispatch(toggleBidPosition(id, true, false, false, true)),
    };
  } else {
    config = {
      ...config,
      submitBidPosition: id => dispatch(submitBid(id, id$)),
      acceptBidPosition: id => dispatch(acceptBid(id, id$)),
      declineBidPosition: id => dispatch(declineBid(id, id$)),
      deleteBid: id => dispatch(toggleBidPosition(id, true, false, id$, true)),
    };
  }
  return config;
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BidTrackerContainer));
