import { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { checkFlag } from 'flags';
import { scrollToId } from 'utilities';
import { BIDDER_LIST, CLASSIFICATIONS, EMPTY_FUNCTION } from 'Constants/PropTypes';
import PaginationWrapper from 'Components/PaginationWrapper/PaginationWrapper';
import Alert from 'Components/Alert/Alert';
import BidderPortfolioCardList from '../BidderPortfolioCardList';
import BidderPortfolioGridList from '../BidderPortfolioGridList';
import BidderPortfolioTable from './BidderPorfolioTable/BidPortfolioTable';

const ID = 'bidder-portfolio-container';

class BidderPortfolioContainer extends Component {
  onPageChange = q => {
    const { pageSize, updatePagination, queryParamUpdate } = this.props;
    scrollToId({ el: '.bidder-portfolio-container', config: { duration: 400 } });
    updatePagination({ pageNumber: q.page, pageSize: pageSize.toString() });
    setTimeout(() => {
      queryParamUpdate({ value: 'skip' });
    }, 600);
  };

  render() {
    const { bidderPortfolio, bidderPortfolioExtraData, pageSize, showListView, isLoading, viewType,
      cdosLength, hideControls, classifications, hasErrored, pageNumber, isCDOD30 } = this.props;

    const showCDOD30 = checkFlag('flags.CDOD30');

    const noResults = get(bidderPortfolio, 'results', []).length === 0;
    const showNoCdosAlert = !cdosLength;
    const showEdit$ = !hideControls && showCDOD30;
    const showExpand = !hideControls;

    const getExtraClientData = () => {
      const combinedArray = bidderPortfolio?.results?.map(item1 => {
        const matchingItem = bidderPortfolioExtraData?.find(item2 => Number(item2?.PER_SEQ_NUM) === Number(item1?.perdet_seq_number));
        return matchingItem ? { ...item1, ...matchingItem } : null;
      }).filter(item => item !== null);

      return combinedArray;
    };

    return (
      <div className="usa-grid-full user-dashboard" id={ID}>
        {!showNoCdosAlert && !hasErrored && isCDOD30 && !noResults &&
          <div className="usa-grid-full bidder-portfolio-listing">
            <BidderPortfolioTable results={bidderPortfolioExtraData.length !== 0 ? getExtraClientData() : []} />
          </div>
        }
        {
          !showNoCdosAlert && !hasErrored && !isCDOD30 &&
          (
            showListView ?
              <BidderPortfolioGridList
                showEdit={showEdit$}
                showExpand={showExpand}
                results={bidderPortfolio.results}
                classifications={classifications}
                viewType={viewType}
              />
              :
              <BidderPortfolioCardList
                results={bidderPortfolio.results}
                classifications={classifications}
                viewType={viewType}
              />
          )
        }
        {
          // if there's no results, don't show pagination
          !noResults && !showNoCdosAlert && !hasErrored &&
           <div className="usa-grid-full react-paginate">
             <PaginationWrapper
               totalResults={bidderPortfolio.count}
               pageSize={pageSize}
               onPageChange={this.onPageChange}
               forcePage={pageNumber}
               marginPagesDisplayed={2}
               pageRangeDisplayed={7}
             />
           </div>
        }
        {
          showNoCdosAlert && !hasErrored &&
          <div className="usa-width-two-thirds">
            <Alert title="You have not selected any CDOs" messages={[{ body: 'Please select at least one CDO from the "Proxy CDO View" filter above.' }]} />
          </div>
        }
        {
          noResults && !isLoading && !showNoCdosAlert && !hasErrored &&
          <div className="usa-width-two-thirds">
            <Alert title="You have no clients within this search criteria." messages={[{ body: 'Try removing filters or using another bid status tab.' }]} />
          </div>
        }
        {
          !isLoading && hasErrored &&
          <div className="usa-width-two-thirds">
            <Alert title="An error has occurred" messages={[{ body: 'Try performing another search' }]} type="error" />
          </div>
        }
      </div>
    );
  }
}

BidderPortfolioContainer.propTypes = {
  bidderPortfolio: BIDDER_LIST.isRequired,
  bidderPortfolioExtraData: BIDDER_LIST.isRequired,
  pageSize: PropTypes.number.isRequired,
  queryParamUpdate: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  showListView: PropTypes.bool,
  classifications: CLASSIFICATIONS,
  isLoading: PropTypes.bool,
  cdosLength: PropTypes.number,
  hideControls: PropTypes.bool,
  hasErrored: PropTypes.bool,
  isCDOD30: PropTypes.bool,
  updatePagination: PropTypes.func,
  viewType: PropTypes.string,
};

BidderPortfolioContainer.defaultProps = {
  showListView: false,
  classifications: [],
  isLoading: false,
  cdosLength: 0,
  hideControls: false,
  hasErrored: false,
  isCDOD30: false,
  setEditClassification: false,
  updatePagination: EMPTY_FUNCTION,
  viewType: '',
};

export default BidderPortfolioContainer;
