import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { BIDDER_LIST } from '../../../Constants/PropTypes';
import BidderPortfolioStatRow from '../BidderPortfolioStatRow';

const BidderPortfolioGridList = ({ results, showEdit, fetchBiddersInfinite }) => (
  <InfiniteScroll
    pageStart={0}
    loadMore={fetchBiddersInfinite}
    hasMore={!!results.next}
    loader={<div className="loader" key={0}>Loading ...</div>}
    threshold={650}
  >
    <ul className="usa-grid-full user-dashboard portfolio-row-list">
      {
        results.results.map(result => (
          <li
            className="portfolio-row"
            key={result.id}
          >
            <BidderPortfolioStatRow
              userProfile={result}
              showEdit={showEdit}
            />
          </li>
        ))
      }
    </ul>
  </InfiniteScroll>
);

BidderPortfolioGridList.propTypes = {
  results: BIDDER_LIST.isRequired,
  fetchBiddersInfinite: PropTypes.func.isRequired,
  showEdit: PropTypes.bool,
};

BidderPortfolioGridList.defaultProps = {
  showEdit: false,
};

export default BidderPortfolioGridList;
