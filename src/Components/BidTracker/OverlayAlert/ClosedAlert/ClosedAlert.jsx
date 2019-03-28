import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../../../LinkButton';


const ClosedAlert = ({ title, date, id }, { condensedView }) => (
  <div className="bid-tracker-alert-container bid-tracker-alert-container--closed">
    <div className="top-text">
      {title} has been filled
    </div>
    <div className="date-text">
      {date}
    </div>
    {
      condensedView &&
      <div className="usa-grid-full">
        <LinkButton toLink={`/profile/bidtracker/${id || ''}`} className="tm-button-transparent">
          Go to Bid Tracker
        </LinkButton>
      </div>
    }
  </div>
);

ClosedAlert.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.number,
};

ClosedAlert.defaultProps = {
  id: 0,
};

ClosedAlert.contextTypes = {
  condensedView: PropTypes.bool,
};

export default ClosedAlert;
