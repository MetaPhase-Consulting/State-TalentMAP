import { Component } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual, omit, pick } from 'lodash';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchClassifications } from 'actions/classifications';
import { BID_PORTFOLIO_FILTERS_TYPE, BID_PORTFOLIO_SORTS_TYPE, CLIENTS_PAGE_SIZES } from 'Constants/Sort';
import { bidderPortfolioCDOsFetchData, bidderPortfolioExtraDetailsFetchData, bidderPortfolioFetchData, getClientDatePerdets, getClientPerdets, panelClientFetchData, saveBidderPortfolioPagination } from 'actions/bidderPortfolio';
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
      defaultKeyword: { value: '' },
      hasHandshake: { value: undefined },
      ordering: { value: props.defaultSort },
      bidderIdsHasLoaded: false,
    };
  }
  // Fetch bidder list and bidder statistics.
  UNSAFE_componentWillMount() {
    const { pageNumber, pageSize } = this.props.bidderPortfolioPagination;
    const pageSize$ = pageSize || 10;
    if (get(this.props, 'cdos', []).length) {
      this.getBidderPortfolio();
    }
    this.props.updatePagination({ pageNumber, pageSize: pageSize$.toString() });
    this.props.fetchBidderPortfolioCDOs();
    this.props.fetchClassifications();
    this.props.fetchAvailableBidders();
    this.props.fetchPanelDates();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const props = ['cdos', 'selectedSeasons']; // removed 'selectedUnassigned'
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
  onQueryParamUpdate = (q) => {
    const { pageSize } = this.props.bidderPortfolioPagination;
    const { query } = this.state;
    if (q && Object.values(q)[0] !== 'skip') {
      this.props.updatePagination({ pageNumber: 1, pageSize });
      this.setState({ [Object.keys(q)[0]]: { value: Object.values(q)[0] } });
      const newQuery = queryParamUpdate(q, query.value);
      query.value = newQuery;
    }
    this.setState({ query }, () => {
      this.getBidderPortfolio();
    });
  };

  // Form our query and then retrieve bidders.
  getBidderPortfolio() {
    const query = this.createSearchQuery();
    const noPanel = this.props.selectedUnassigned.some(obj => obj.value === 'noPanel');
    const noBids = this.props.selectedUnassigned.some(obj => obj.value === 'noBids');
    const filters = ['handshake', 'eligible_bidders', 'cusp_bidders',
      'separations', 'languages', 'classification']; // no need for panel_clients

    if (query.hasHandshake === 'panel_clients' || query.hasHandshake === 'unassigned_filters') return;

    if (noBids || noPanel || filters.includes(query.hasHandshake)) {
      this.props.fetchUnassignedBidderTypes(query);
    }

    if (!noBids && !noPanel && !filters.includes(query.hasHandshake) && query.hasHandshake !== 'panel_clients') {
      this.props.fetchBidderPortfolio(query);
    }

    if (!noBids && !noPanel && !filters.includes(query.hasHandshake) && query.hasHandshake !== 'panel_clients' && this.props.isCDOD30) {
      this.props.fetchBidderPortfolioCDO(query);
    }
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
      page: pageNumber,
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
    );
    return newQuery;
  }

  render() {
    const { bidderPortfolio, bidderPortfolioExtraData, bidderPortfolioIsLoading, bidderPortfolioHasErrored,
      bidderPortfolioCounts, bidderPortfolioCountsIsLoading, availableBiddersIdsLoading,
      bidderPortfolioCountsHasErrored, cdos, bidderPortfolioCDOsIsLoading,
      updatePagination, bidderPortfolioPagination, viewType,
      classifications, classificationsIsLoading, classificationsHasErrored } = this.props;
    const { hasHandshake, ordering, bidderIdsHasLoaded } = this.state;
    const isLoading = (bidderPortfolioCDOsIsLoading || bidderPortfolioIsLoading
      || (availableBiddersIdsLoading && !bidderIdsHasLoaded)) && cdos.length;

    return (
      <div>
        <BidderPortfolioPage
          bidderPortfolio={bidderPortfolio}
          bidderPortfolioExtraData={bidderPortfolioExtraData}
          bidderPortfolioIsLoading={isLoading}
          bidderPortfolioHasErrored={bidderPortfolioHasErrored}
          pageSize={bidderPortfolioPagination.pageSize || 10}
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
          updatePagination={updatePagination}
          viewType={viewType}
          isCDOD30={this.props.isCDOD30}
          setEditClassification={this.props.setEditClassification}
        />
      </div>
    );
  }
}

BidderPortfolio.propTypes = {
  bidderPortfolio: BIDDER_LIST.isRequired,
  bidderPortfolioExtraData: BIDDER_LIST.isRequired,
  bidderPortfolioIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioHasErrored: PropTypes.bool.isRequired,
  fetchBidderPortfolio: PropTypes.func.isRequired,
  fetchUnassignedBidderTypes: PropTypes.func.isRequired,
  fetchBidderPortfolioCDO: PropTypes.func.isRequired,
  bidderPortfolioCounts: BIDDER_PORTFOLIO_COUNTS.isRequired,
  bidderPortfolioCountsIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioCountsHasErrored: PropTypes.bool.isRequired,
  fetchBidderPortfolioCDOs: PropTypes.func.isRequired,
  isCDOD30: PropTypes.bool,
  setEditClassification: PropTypes.bool,
  cdos: PropTypes.arrayOf(PropTypes.shape({})),
  selectedSeasons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])), // eslint-disable-line
  fetchClassifications: PropTypes.func.isRequired,
  fetchPanelDates: PropTypes.func.isRequired,
  classifications: CLASSIFICATIONS,
  classificationsHasErrored: PropTypes.bool.isRequired,
  classificationsIsLoading: PropTypes.bool.isRequired,
  bidderPortfolioCDOsIsLoading: PropTypes.bool,
  defaultPageSize: PropTypes.number,
  defaultSort: PropTypes.string,
  fetchAvailableBidders: PropTypes.func.isRequired,
  selectedUnassigned: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  availableBiddersIdsLoading: PropTypes.bool,
  updatePagination: PropTypes.func,
  bidderPortfolioPagination: PropTypes.shape({
    pageNumber: PropTypes.number,
    pageSize: PropTypes.string,
  }),
  viewType: PropTypes.string,
};

BidderPortfolio.defaultProps = {
  bidderPortfolio: { results: [] },
  bidderPortfolioExtraData: { results: [] },
  bidderPortfolioIsLoading: false,
  bidderPortfolioHasErrored: false,
  fetchBidderPortfolio: EMPTY_FUNCTION,
  fetchBidderPortfolioCDO: EMPTY_FUNCTION,
  fetchUnassignedBidderTypes: EMPTY_FUNCTION,
  fetchPanelPerdets: EMPTY_FUNCTION,
  bidderPortfolioCounts: {},
  bidderPortfolioCountsIsLoading: false,
  bidderPortfolioCountsHasErrored: false,
  fetchBidderPortfolioCDOs: EMPTY_FUNCTION,
  classificationsIsLoading: false,
  classificationsHasErrored: false,
  fetchClassifications: EMPTY_FUNCTION,
  fetchPanelDates: EMPTY_FUNCTION,
  isCDOD30: false,
  setEditClassification: false,
  cdos: [],
  selectedSeasons: [],
  classifications: [],
  bidderPortfolioCDOsIsLoading: false,
  defaultSort: '',
  fetchAvailableBidders: EMPTY_FUNCTION,
  selectedUnassigned: [],
  availableBiddersIdsLoading: false,
  bidderPortfolioPagination: {},
  updatePagination: EMPTY_FUNCTION,
  defaultPageSize: CLIENTS_PAGE_SIZES.defaultSort,
  viewType: '',
};

const mapStateToProps = state => ({
  bidderPortfolio: state.bidderPortfolio,
  bidderPortfolioExtraData: state.bidderPortfolioExtraData,
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
  bidderPortfolioPagination: state.bidderPortfolioPagination,
  isCDOD30: state.isCDOD30,
  setEditClassification: state.setEditClassification,
});

export const mapDispatchToProps = dispatch => ({
  fetchBidderPortfolio: async query => dispatch(bidderPortfolioFetchData(query)),
  fetchBidderPortfolioCDO: async query => {
    await dispatch(bidderPortfolioFetchData(query, true));
    dispatch(bidderPortfolioExtraDetailsFetchData());
  },
  fetchUnassignedBidderTypes: async query => {
    await dispatch(getClientPerdets(query));
    dispatch(bidderPortfolioExtraDetailsFetchData());
  },
  fetchPanelPerdets: async query => {
    await dispatch(getClientDatePerdets(query));
    dispatch(bidderPortfolioExtraDetailsFetchData());
  },
  fetchBidderPortfolioCDOs: () => dispatch(bidderPortfolioCDOsFetchData()),
  fetchPanelDates: () => dispatch(panelClientFetchData()),
  fetchClassifications: () => dispatch(fetchClassifications()),
  fetchAvailableBidders: () => dispatch(availableBiddersIds()),
  updatePagination: (arr = {}) => dispatch(saveBidderPortfolioPagination(arr)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BidderPortfolio));
