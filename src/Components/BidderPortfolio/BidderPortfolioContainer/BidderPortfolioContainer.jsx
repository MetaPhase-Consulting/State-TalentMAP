import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { BIDDER_LIST, CLASSIFICATIONS } from '../../../Constants/PropTypes';
import { scrollToId } from '../../../utilities';
import BidderPortfolioCardList from '../BidderPortfolioCardList';
import BidderPortfolioGridList from '../BidderPortfolioGridList';
import PaginationWrapper from '../../PaginationWrapper/PaginationWrapper';
import Alert from '../../Alert/Alert';

const ID = 'bidder-portfolio-container';

class BidderPortfolioContainer extends Component {
  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
  }
  onPageChange(q) {
    scrollToId({ el: '.bidder-portfolio-container', config: { duration: 400 } });
    setTimeout(() => {
      this.props.queryParamUpdate(q);
    }, 600);
  }
  render() {
    const { bidderPortfolio, pageSize, pageNumber, showListView, showEdit,
      classifications } = this.props;
    const noResults = get(bidderPortfolio, 'results', []).length === 0;
    return (
      <div className="usa-grid-full user-dashboard" id={ID}>
        {
          showListView ?
            <BidderPortfolioGridList
              showEdit={showEdit}
              results={bidderPortfolio.results}
              classifications={classifications}
            />
            :
            <BidderPortfolioCardList
              results={bidderPortfolio.results}
              classifications={classifications}
            />
        }
        {
           // if there's no results, don't show pagination
           !!bidderPortfolio.results && !!bidderPortfolio.results.length &&
           // finally, render the pagination
           <div className="usa-grid-full react-paginate">
             <PaginationWrapper
               totalResults={bidderPortfolio.count}
               pageSize={pageSize}
               onPageChange={this.onPageChange}
               forcePage={pageNumber}
             />
           </div>
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
  pageSize: PropTypes.number.isRequired,
  queryParamUpdate: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  showListView: PropTypes.bool,
  showEdit: PropTypes.bool,
  classifications: CLASSIFICATIONS,
};

BidderPortfolioContainer.defaultProps = {
  showListView: false,
  showEdit: false,
  classifications: [],
};

export default BidderPortfolioContainer;
