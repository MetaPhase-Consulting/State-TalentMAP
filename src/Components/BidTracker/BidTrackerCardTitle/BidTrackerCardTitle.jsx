import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BID_STATISTICS_OBJECT, POST_DETAILS, BID_CYCLE_NAME_TYPE } from 'Constants/PropTypes';
import { getPostName, getBidCycleName, formatDate } from 'utilities';
import { getStatusProperty } from 'Constants/BidStatuses';
import { APPROVED_PROP } from 'Constants/BidData';
import BidCount from '../../BidCount';

const BidTrackerCardTitle = ({
  title,
  positionNumber,
  id,
  bidStatistics,
  post,
  showBidCount,
  status,
  bidCycle,
  ted,
},
{ condensedView, priorityExists, isPriority }) => {
  const viewPosition = (
    <div className="bid-tracker-card-title-link">
      <Link to={`/details/${id}`}>View position</Link>
    </div>
  );
  let title$ = `${title}${positionNumber ? ` (${positionNumber})` : ''}`;
  if (condensedView && priorityExists && isPriority) {
    if (status === APPROVED_PROP) {
      title$ = `Assignment: ${title}`;
    } else {
      title$ = `Pending Assignment: ${title}`;
    }
  }
  if (condensedView && priorityExists && !isPriority) {
    const status$ = getStatusProperty(status, 'text');
    title$ = `${status$} (on-hold)`;
  }
  return (
    <div className="usa-grid-full">
      <div className="usa-grid-full bid-tracker-card-title-container">
        <div className="bid-tracker-card-title-text">{title$}</div>
        {!condensedView && viewPosition}
      </div>
      <div className="usa-grid-full bid-tracker-bottom-link-container">
        <div className={`bid-tracker-card-title-bottom ${!condensedView ? 'bid-tracker-card-title-bottom--full-width' : ''}`}>
          <strong>Location:</strong> {getPostName(post)}
        </div>
        {
          !condensedView &&
          <div className="bid-tracker-card-title-bottom">
            <strong>Bid cycle:</strong> {getBidCycleName(bidCycle)}
          </div>
        }
        {condensedView && viewPosition}
        {
          showBidCount && !condensedView &&
            <span className="bid-stats">
              <BidCount bidStatistics={bidStatistics} altStyle />
            </span>
        }
        {
          !condensedView &&
          <div className="bid-tracker-card-title-bottom">
            <strong>TED:</strong> {formatDate('2020-07-02T05:00:00Z')}
            {/* placeholder while back-end gets built out. change to:
            <strong>TED:</strong> {formatDate(ted)} */}
          </div>
        }
      </div>
    </div>
  );
};

BidTrackerCardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  positionNumber: PropTypes.string,
  id: PropTypes.number.isRequired,
  bidStatistics: BID_STATISTICS_OBJECT.isRequired,
  post: POST_DETAILS.isRequired,
  showBidCount: PropTypes.bool,
  status: PropTypes.string.isRequired,
  bidCycle: BID_CYCLE_NAME_TYPE,
  ted: PropTypes.number.isRequired,
};

BidTrackerCardTitle.defaultProps = {
  positionNumber: '',
  showBidCount: true,
  bidCycle: '',
};

BidTrackerCardTitle.contextTypes = {
  condensedView: PropTypes.bool,
  priorityExists: PropTypes.bool,
  isPriority: PropTypes.bool,
};

export default BidTrackerCardTitle;
