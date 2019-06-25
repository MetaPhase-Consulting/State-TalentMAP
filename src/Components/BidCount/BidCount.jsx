import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import BidCountNumber from './BidCountNumber';
import { BID_STATISTICS_OBJECT } from '../../Constants/PropTypes';

const BidCount = ({ bidStatistics, hideLabel, label, altStyle, isCondensed }) => {
  let labelClass = 'bid-count-label';
  if (hideLabel) { labelClass = `${labelClass} usa-sr-only`; }
  const id = shortid.generate();
  const id$ = `bid-counts-${id}`;
  return (
    <div className={`usa-grid-full bid-count-container ${altStyle ? 'bid-count-secondary' : ''} ${isCondensed ? 'bid-count-condensed' : ''}`}>
      <div className={labelClass} id={id$}>{label}</div>
      {/* set an aria-labelledby so that screen readers understand the purpose of the list */}
      <ul className="bid-count-list" aria-labelledby={id$}>
        <BidCountNumber type="totalBids" number={bidStatistics.total_bids || 0} />
        <BidCountNumber type="inGradeBids" number={bidStatistics.in_grade || 0} />
        <BidCountNumber type="atSkillBids" number={bidStatistics.at_skill || 0} />
        <BidCountNumber type="inGradeAtSkillBids" number={bidStatistics.in_grade_at_skill || 0} />
      </ul>
    </div>
  );
};

BidCount.propTypes = {
  bidStatistics: BID_STATISTICS_OBJECT,
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  altStyle: PropTypes.bool,
  isCondensed: PropTypes.bool,
};

BidCount.defaultProps = {
  bidStatistics: {},
  hideLabel: false,
  label: 'Bid count:',
  altStyle: false,
  isCondensed: false,
};

export default BidCount;
