import React from 'react';
import BidCount from '../BidCount';
import { BID_STATISTICS_OBJECT } from '../../Constants/PropTypes';

const ResultsCondensedCardStats = ({ bidStatistics }) => (
  <div className="condensed-card-footer condensed-card-statistics">
    <div className="usa-grid-full condensed-card-statistics-inner">
      <BidCount bidStatistics={bidStatistics} />
    </div>
  </div>
);

ResultsCondensedCardStats.propTypes = {
  bidStatistics: BID_STATISTICS_OBJECT,
};

ResultsCondensedCardStats.defaultProps = {
  bidStatistics: {},
};

export default ResultsCondensedCardStats;
