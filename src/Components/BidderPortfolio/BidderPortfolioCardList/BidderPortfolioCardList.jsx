import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { BIDDER_LIST } from '../../../Constants/PropTypes';
import BidderPortfolioStatCard from '../BidderPortfolioStatCard';

const BidderPortfolioCardList = ({ results, fetchBiddersInfinite }) => (
  <InfiniteScroll
    className="usa-grid-full user-dashboard bidder-portfolio-stat-card-list"
    pageStart={0}
    loadMore={fetchBiddersInfinite}
    hasMore={!!results.next}
    loader={<div style={{ width: '100%' }} className="loader" key={0}>Loading ...</div>}
    threshold={650}
  >
    {
      results.results.map(result => (
        <div className="bidder-portfolio-stat-card-container" key={result.id}>
          <BidderPortfolioStatCard
            userProfile={result}
          />
        </div>
      ))
    }
  </InfiniteScroll>
);

BidderPortfolioCardList.propTypes = {
  results: BIDDER_LIST.isRequired,
  fetchBiddersInfinite: PropTypes.func.isRequired,
};

export default BidderPortfolioCardList;
