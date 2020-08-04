import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BID_STATISTICS_OBJECT, POST_DETAILS, BID_CYCLE_NAME_TYPE } from 'Constants/PropTypes';
import { getPostName, getBidCycleName } from 'utilities';
import { getStatusProperty } from 'Constants/BidStatuses';
import { APPROVED_PROP } from 'Constants/BidData';
import StaticDevContent from 'Components/StaticDevContent';
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
},
{ condensedView, priorityExists, isPriority }) => {
  const viewPosition = (
    <div className="bid-tracker-card-title-link">
      <Link to={`/${status === APPROVED_PROP ? 'archived' : 'details'}/${id}`}>View position</Link>
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
          <strong> | Posted:</strong> 07/02/2020
        </div>
        {
          !condensedView &&
          <div className="bid-tracker-card-title-bottom">
            <strong>Bid Cycle:</strong> {getBidCycleName(bidCycle)}
          </div>
        }
        {condensedView && viewPosition}
        {/* {
          showBidCount && !condensedView &&
            <span className="bid-stats">
              <BidCount bidStatistics={bidStatistics} altStyle />
            </span>
        } */}
      </div>
      <div className="usa-grid-full bid-tracker-bottom-link-container">
        {
          !condensedView &&
          <div className="bid-tracker-card-title-bottom">
            <StaticDevContent>
              <strong>Bureau:</strong> (INR) BUREAU OF INTELLIGENCE AND RESEARCH
            </StaticDevContent>
          </div>
        }
        {condensedView && viewPosition}
        {
          showBidCount && !condensedView &&
            <span className="bid-tracker-bid-stats">
              <BidCount bidStatistics={bidStatistics} altStyle />
            </span>
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
