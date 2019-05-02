import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BIDDER_LIST } from '../../../Constants/PropTypes';
import { scrollToTop } from '../../../utilities';
import BidderPortfolioCardList from '../BidderPortfolioCardList';
import BidderPortfolioGridList from '../BidderPortfolioGridList';
import Alert from '../../Alert/Alert';

class BidderPortfolioContainer extends Component {
  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
  }
  onPageChange(q) {
    scrollToTop();
    this.props.queryParamUpdate(q);
  }
  render() {
    const { bidderPortfolio, showListView, showEdit,
      fetchBiddersInfinite } = this.props;
    const noResults = bidderPortfolio.results.length === 0;
    return (
      <div className="usa-grid-full user-dashboard">
        {
          showListView ?
            <BidderPortfolioGridList
              showEdit={showEdit}
              results={bidderPortfolio}
              fetchBiddersInfinite={fetchBiddersInfinite}
            />
            :
            <BidderPortfolioCardList
              results={bidderPortfolio}
              fetchBiddersInfinite={fetchBiddersInfinite}
            />
        }
        {
          noResults &&
          <div className="usa-width-two-thirds">
            <Alert title="You have no clients within this search criteria." messages={[{ body: 'Try removing filters or using another bid status tab.' }]} />
          </div>
        }
      </div>
    );
  }
}

BidderPortfolioContainer.propTypes = {
  bidderPortfolio: BIDDER_LIST.isRequired,
  queryParamUpdate: PropTypes.func.isRequired,
  showListView: PropTypes.bool,
  showEdit: PropTypes.bool,
  fetchBiddersInfinite: PropTypes.func.isRequired,
};

BidderPortfolioContainer.defaultProps = {
  showListView: false,
  showEdit: false,
};

export default BidderPortfolioContainer;
