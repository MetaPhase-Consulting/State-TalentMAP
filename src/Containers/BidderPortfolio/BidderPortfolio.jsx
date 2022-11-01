import { Component } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual, omit, pick } from 'lodash';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchClassifications } from 'actions/classifications';
import { BID_PORTFOLIO_FILTERS_TYPE, BID_PORTFOLIO_SORTS_TYPE, CLIENTS_PAGE_SIZES } from 'Constants/Sort';
import { bidderPortfolioCDOsFetchData, bidderPortfolioFetchData, saveBidderPortfolioPagination } from 'actions/bidderPortfolio';
import { availableBiddersIds } from 'actions/availableBidders';
import { BIDDER_LIST, BIDDER_PORTFOLIO_COUNTS, CLASSIFICATIONS, EMPTY_FUNCTION } from 'Constants/PropTypes';
import { BIDDER_PORTFOLIO_PARAM_OBJECTS } from 'Constants/EndpointParams';
import queryParamUpdate from '../queryParams';
import BidderPortfolioPage from '../../Components/BidderPortfolio/BidderPortfolioPage';

class BidderPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      query: { value: window.location.search.replace('?', '') || '' },
      // limit: { value: CLIENTS_PAGE_SIZES.defaultSort },
      // limit: { value: props.defaultPageSize },
      // page: { value: 1 },
      defaultKeyword: { value: '' },
      hasHandshake: { value: props.defaultHandshakeFilter },
      ordering: { value: props.defaultSort },
      bidderIdsHasLoaded: false,
    };
  }
  // Fetch bidder list and bidder statistics.
  UNSAFE_componentWillMount() {
    if (get(this.props, 'cdos', []).length) {
      this.getBidderPortfolio();
    }
    this.props.fetchBidderPortfolioCDOs();
    this.props.fetchClassifications();
    this.props.fetchAvailableBidders();
    // this.props.saveBidderPortfolioPagination();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const props = ['cdos', 'selectedSeasons', 'selectedUnassigned'];
    if (!isEqual(pick(this.props, props), pick(nextProps, props))) {
      this.getBidderPortfolio();
    }
    if (this.props.availableBiddersIdsLoading && !nextProps.availableBiddersIdsLoading) {
      this.setState({
        bidderIdsHasLoaded: true,
      });
    }
  }

  // For when we need to UPDATE the ENTIRE value of a filter.
  // Much of the logic is abstracted to a helper, but we need to set state within
  // the instance.
  onQueryParamUpdate = (q = {}) => {
    const { query } = this.state;
    if (q) {
      this.setState({ [Object.keys(q)[0]]: { value: Object.values(q)[0] } });
      const newQuery = queryParamUpdate(q, query.value);
      query.value = newQuery;
    }
    this.setState({ query }, () => {
      this.getBidderPortfolio();
    });

    // const newQueryObject = queryParamUpdate(q, query.value, true);

    // and update the query state

    // convert to a number, if it exists
    // const newQueryObjectPage = parseInt(newQueryObject.page, 10);
    // bidderPortfolioPagination.pageNumber = newQueryObjectPage || 1;
    // saveBidderPortfolioPagination?
    // maybe empty default object for q
    // if empty, skip everything else and just setState (don't need to update)
    // still want to call getBidderPortfolio
  };

  // Form our query and then retrieve bidders.
  getBidderPortfolio() {
    const query = this.createSearchQuery();
    this.props.fetchBidderPortfolio(query);
  }

  // We use a human-readable "type" query param for navigation that isn't actually
  // passed to the API query. So we map it against a real query param here.
  // We pass any other params in the query, but aren't passing those to the URL currently.
  mapTypeToQuery() {
    const { query } = this.state;
    let parsedQuery = queryString.parse(query.value);
    if ((Object.keys(BIDDER_PORTFOLIO_PARAM_OBJECTS)).includes(parsedQuery.type)) {
      parsedQuery = Object.assign(
        parsedQuery, { ...BIDDER_PORTFOLIO_PARAM_OBJECTS[parsedQuery.type] },
      );
      parsedQuery = omit(parsedQuery, ['type']);
    }
    query.value = queryString.stringify(parsedQuery);
    this.setState({ query });
  }

  // When we trigger a new search, we reset the page number and limit.
  createSearchQuery() {
    const { hasHandshake, ordering } = this.state;
    const { pageNumber, pageSize } = this.props.bidderPortfolioPagination;
    // set our default page size
    const size = parseInt(pageSize, 10) || this.props.defaultPageSize;
    this.mapTypeToQuery();
    const query = {
      page: pageNumber, // don't we want these to be 1 and 10 respectively?
      limit: size,
      hasHandshake: hasHandshake.value,
      ordering: ordering.value,
    };
    const queryState = queryString.parse(this.state.query.value);
    let newQuery = { ...queryState, ...query };
    newQuery = queryParamUpdate(
      {},
      queryString.stringify(newQuery),
      true,
      false,
    ); // filter undefined values
    return newQuery;
  }

  render() {
    console.log('scootty: ', this.props);
    const { bidderPortfolio, bidderPortfolioIsLoading, bidderPortfolioHasErrored,
      bidderPortfolioCounts, bidderPortfolioCountsIsLoading, availableBiddersIdsLoading,
      bidderPortfolioCountsHasErrored, cdos, bidderPortfolioCDOsIsLoading,
      // eslint-disable-next-line no-shadow
      saveBidderPortfolioPagination,
      // eslint-disable-next-line max-len
      classifications, classificationsIsLoading, classificationsHasErrored, bidderPortfolioPagination } = this.props;
    const { hasHandshake, ordering, bidderIdsHasLoaded } = this.state;
    // console.log('bidderPortfolio page number: ', page);
    // console.log(cdos);
    const isLoading = (bidderPortfolioCDOsIsLoading || bidderPortfolioIsLoading
      || (availableBiddersIdsLoading && !bidderIdsHasLoaded)) && cdos.length;
    return (
      <div>
        <BidderPortfolioPage
          bidderPortfolio={bidderPortfolio}
          bidderPortfolioIsLoading={isLoading}
          bidderPortfolioHasErrored={bidderPortfolioHasErrored}
          pageSize={bidderPortfolioPagination.pageSize}
          queryParamUpdate={this.onQueryParamUpdate}
          pageNumber={bidderPortfolioPagination.pageNumber}
          bidderPortfolioCounts={bidderPortfolioCounts}
          bidderPortfolioCountsIsLoading={bidderPortfolioCountsIsLoading}
          bidderPortfolioCountsHasErrored={bidderPortfolioCountsHasErrored}
          classificationsIsLoading={classificationsIsLoading}
          classificationsHasErrored={classificationsHasErrored}
          classifications={classifications}
          cdosLength={cdos.length}
          defaultHandshake={hasHandshake.value}
          defaultOrdering={ordering.value}
          updatePagination={saveBidderPortfolioPagination}
        />
      </div>
    );
  }
}

BidderPortfolio.propTypes = {
  bidderPortfolio: BIDDER_LIST.isRequired,
  bidderPortfolioIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioHasErrored: PropTypes.bool.isRequired,
  fetchBidderPortfolio: PropTypes.func.isRequired,
  bidderPortfolioCounts: BIDDER_PORTFOLIO_COUNTS.isRequired,
  bidderPortfolioCountsIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioCountsHasErrored: PropTypes.bool.isRequired,
  fetchBidderPortfolioCDOs: PropTypes.func.isRequired,
  cdos: PropTypes.arrayOf(PropTypes.shape({})),
  selectedSeasons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])), // eslint-disable-line
  fetchClassifications: PropTypes.func.isRequired,
  classifications: CLASSIFICATIONS,
  classificationsHasErrored: PropTypes.bool.isRequired,
  classificationsIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioCDOsIsLoading: PropTypes.bool,
  defaultHandshakeFilter: PropTypes.string,
  defaultPageSize: PropTypes.number.isRequired,
  defaultSort: PropTypes.string,
  fetchAvailableBidders: PropTypes.func.isRequired,
  selectedUnassigned: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  availableBiddersIdsLoading: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  pageNumber: PropTypes.number,
  saveBidderPortfolioPagination: PropTypes.func.isRequired,
};

BidderPortfolio.defaultProps = {
  bidderPortfolio: { results: [] },
  bidderPortfolioIsLoading: false,
  bidderPortfolioHasErrored: false,
  fetchBidderPortfolio: EMPTY_FUNCTION,
  bidderPortfolioCounts: {},
  bidderPortfolioCountsIsLoading: false,
  bidderPortfolioCountsHasErrored: false,
  fetchBidderPortfolioCDOs: EMPTY_FUNCTION,
  classificationsIsLoading: false,
  classificationsHasErrored: false,
  fetchClassifications: EMPTY_FUNCTION,
  cdos: [],
  selectedSeasons: [],
  classifications: [],
  bidderPortfolioCDOsIsLoading: false,
  defaultHandshakeFilter: '',
  defaultSort: '',
  fetchAvailableBidders: EMPTY_FUNCTION,
  selectedUnassigned: [],
  availableBiddersIdsLoading: false,
  pageNumber: 1,
};

const mapStateToProps = state => ({
  bidderPortfolio: state.bidderPortfolio,
  bidderPortfolioIsLoading: state.bidderPortfolioIsLoading,
  bidderPortfolioHasErrored: state.bidderPortfolioHasErrored,
  bidderPortfolioCounts: state.bidderPortfolioCounts,
  bidderPortfolioCountsIsLoading: state.bidderPortfolioCountsIsLoading,
  bidderPortfolioCountsHasErrored: state.bidderPortfolioCountsHasErrored,
  bidderPortfolioCDOs: state.bidderPortfolioCDOs,
  bidderPortfolioCDOsIsLoading: state.bidderPortfolioCDOsIsLoading,
  bidderPortfolioCDOsHasErrored: state.bidderPortfolioCDOsHasErrored,
  cdos: state.bidderPortfolioSelectedCDOsToSearchBy,
  selectedSeasons: state.bidderPortfolioSelectedSeasons,
  classificationsIsLoading: state.classificationsIsLoading,
  classificationsHasErrored: state.classificationsHasErrored,
  classifications: state.classifications,
  defaultPageSize: get(state, `sortPreferences.${CLIENTS_PAGE_SIZES}.defaultSort`, CLIENTS_PAGE_SIZES.defaultSort),
  defaultHandshakeFilter: get(state, `sortPreferences.${BID_PORTFOLIO_FILTERS_TYPE}.defaultSort`, BID_PORTFOLIO_FILTERS_TYPE.defaultSort),
  defaultSort: get(state, `sortPreferences.${BID_PORTFOLIO_SORTS_TYPE}.defaultSort`, BID_PORTFOLIO_SORTS_TYPE.defaultSort),
  selectedUnassigned: state.bidderPortfolioSelectedUnassigned,
  availableBiddersIdsLoading: state.availableBiddersIdsLoading,
  // pageNumber: state.bidderPortfolioPageNumber,
  bidderPortfolioPagination: state.bidderPortfolioPagination,
});

export const mapDispatchToProps = dispatch => ({
  fetchBidderPortfolio: query => dispatch(bidderPortfolioFetchData(query)),
  fetchBidderPortfolioCDOs: () => dispatch(bidderPortfolioCDOsFetchData()),
  fetchClassifications: () => dispatch(fetchClassifications()),
  fetchAvailableBidders: () => dispatch(availableBiddersIds()),
  // eslint-disable-next-line max-len
  saveBidderPortfolioPagination: paginationObject => dispatch(saveBidderPortfolioPagination(paginationObject)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BidderPortfolio));
