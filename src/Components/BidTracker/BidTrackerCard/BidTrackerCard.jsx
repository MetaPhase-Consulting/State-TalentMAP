/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { BID_OBJECT, USER_PROFILE, EMPTY_FUNCTION } from '../../../Constants/PropTypes';
import BidSteps from '../BidStep';
import BidTrackerCardBottom from '../BidTrackerCardBottom';
import BidTrackerCardTop from '../BidTrackerCardTop';
import OverlayAlert from '../OverlayAlert';
import BoxShadow from '../../BoxShadow';
import BidCount from '../../BidCount';
import { shouldShowAlert } from '../BidHelpers';
import {
  APPROVED_PROP,
  HAND_SHAKE_ACCEPTED_PROP,
  PRE_PANEL_PROP,
  IN_PANEL_PROP,
  BID_EXPLANATION_TEXT,
} from '../../../Constants/BidData';
import { formatDate, formatIdSpacing, getTimeDistanceInWords } from '../../../utilities';

class BidTrackerCard extends Component {
  getChildContext() {
    const { bid, condensedView, priorityExists, readOnly } = this.props;
    return { condensedView, priorityExists, isPriority: bid.is_priority, readOnly };
  }
  render() {
    const { bid, acceptBid, condensedView, declineBid, priorityExists, submitBid, deleteBid,
      showBidCount, userProfile, useCDOView } = this.props;
    // determine whether we render an alert on top of the card
    const showAlert = shouldShowAlert(bid, { condensedView });
    // determine whether we should show the contacts section based on the status
    const showContacts = [APPROVED_PROP, HAND_SHAKE_ACCEPTED_PROP, PRE_PANEL_PROP, IN_PANEL_PROP]
                        .includes(bid.status);
    // add class to container for draft since we need to apply an overflow:hidden for drafts only
    const bidStatus = get(bid, 'status', '');
    const statusClass = `bid-tracker-bid-steps-container--${formatIdSpacing(bidStatus)}`;
    const bidStatistics = get(bid, 'bid_statistics[0]', {});
    const containerClass = [
      'bid-tracker',
      condensedView ? 'bid-tracker--condensed' : '',
      bid.status === APPROVED_PROP ? 'bid-tracker--is-priority--approved' : '',
      bid.is_priority ? 'bid-tracker--is-priority' : 'bid-tracker--is-not-priority',
      priorityExists ? 'bid-tracker--priority-exists' : '',
    ].join(' ');
    const showBidCount$ = showBidCount && !priorityExists;
    const questionText = get(BID_EXPLANATION_TEXT, `[${bid.status}]`);
    return (
      <BoxShadow className={containerClass} id={`bid-${bid.id}`}>
        <div className="bid-tracker-inner-container">
          <BidTrackerCardTop
            bid={bid}
            deleteBid={deleteBid}
            showBidCount={showBidCount$}
            hideDelete={priorityExists}
            questionText={questionText}
            useCDOView={useCDOView}
          />
          <div className={`usa-grid-full padded-container-inner bid-tracker-bid-steps-container ${statusClass}`}>
            <BidSteps bid={bid} />
            {
              showAlert &&
                <OverlayAlert
                  bid={bid}
                  acceptBid={acceptBid}
                  declineBid={declineBid}
                  submitBid={submitBid}
                  deleteBid={deleteBid}
                />
            }
          </div>
        </div>
        {
          showContacts && !condensedView &&
            <div className="usa-grid-full bid-tracker-card-bottom-container">
              <div className="padded-container-inner">
                <BidTrackerCardBottom
                  reviewer={bid.reviewer}
                  bureau={bid.position.bureau}
                  userProfile={userProfile}
                />
              </div>
            </div>
        }
        {
          condensedView &&
            <div className="usa-grid-full bid-tracker-stats">
              <span>{!!bid.update_date && getTimeDistanceInWords(bid.update_date)}</span>
              <span>Added to Bid List: {formatDate(bid.create_date)}</span>
              {showBidCount$ && <BidCount altStyle isCondensed bidStatistics={bidStatistics} />}
            </div>
        }
      </BoxShadow>
    );
  }
}

BidTrackerCard.propTypes = {
  bid: BID_OBJECT.isRequired,
  acceptBid: PropTypes.func,
  declineBid: PropTypes.func,
  submitBid: PropTypes.func.isRequired,
  deleteBid: PropTypes.func.isRequired,
  userProfile: USER_PROFILE,
  showBidCount: PropTypes.bool,
  condensedView: PropTypes.bool,
  priorityExists: PropTypes.bool,
  useCDOView: PropTypes.bool,
};

BidTrackerCard.defaultProps = {
  acceptBid: EMPTY_FUNCTION,
  declineBid: EMPTY_FUNCTION,
  userProfile: {},
  showBidCount: true,
  condensedView: false,
  priorityExists: false,
  useCDOView: false,
};

BidTrackerCard.childContextTypes = {
  condensedView: PropTypes.bool,
  priorityExists: PropTypes.bool,
  isPriority: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default BidTrackerCard;
