import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { POSITION_SEARCH_RESULTS, SORT_BY_PARENT_OBJECT, PILL_ITEM_ARRAY,
  ACCORDION_SELECTION_OBJECT, FILTER_ITEMS_ARRAY, USER_PROFILE, BID_RESULTS,
  MISSION_DETAILS_ARRAY, POST_DETAILS_ARRAY, EMPTY_FUNCTION } from '../../Constants/PropTypes';
import { filterPVSorts, filterTandemSorts } from '../../Constants/Sort';
import { ACCORDION_SELECTION } from '../../Constants/DefaultProps';
import ResultsContainer from '../ResultsContainer/ResultsContainer';
import ResultsSearchHeader from '../ResultsSearchHeader/ResultsSearchHeader';
import ResultsFilterContainer from '../ResultsFilterContainer/ResultsFilterContainer';
import MediaQuery from '../MediaQuery';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: { value: 0 },
    };
  }

  getChildContext() {
    return {
      isProjectedVacancy: this.props.isProjectedVacancy,
      isClient: this.props.isClient,
    };
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  getKeywordValue() {
    return this.keywordRef ? this.keywordRef.getValue() : null;
  }

  render() {
    const { results, isLoading, hasErrored, sortBy, defaultKeyword, defaultLocation, resetFilters,
      pillFilters, defaultSort, pageSizes, defaultPageSize, onQueryParamToggle,
      defaultPageNumber, onQueryParamUpdate, filters, userProfile,
      selectedAccordion, setAccordion, scrollToTop,
      fetchMissionAutocomplete, missionSearchResults, missionSearchIsLoading,
      missionSearchHasErrored, fetchPostAutocomplete,
      postSearchResults, postSearchIsLoading, postSearchHasErrored, shouldShowSearchBar,
      bidList, isProjectedVacancy, filtersIsLoading, showClear, shouldShowMobileFilter }
      = this.props;
    const { isTandemSearch } = this.context;
    const hasLoaded = !isLoading && results.results && !!results.results.length;

    let sortBy$ = isProjectedVacancy ? filterPVSorts(sortBy) : sortBy;
    sortBy$ = isTandemSearch ? filterTandemSorts(sortBy$) : sortBy;

    const filterContainer = (
      <ResultsFilterContainer
        filters={filters}
        isLoading={filtersIsLoading}
        onQueryParamUpdate={onQueryParamUpdate}
        onChildToggle={this.onChildToggle}
        onQueryParamToggle={onQueryParamToggle}
        resetFilters={resetFilters}
        setAccordion={setAccordion}
        selectedAccordion={selectedAccordion}
        fetchMissionAutocomplete={fetchMissionAutocomplete}
        missionSearchResults={missionSearchResults}
        missionSearchIsLoading={missionSearchIsLoading}
        missionSearchHasErrored={missionSearchHasErrored}
        fetchPostAutocomplete={fetchPostAutocomplete}
        postSearchResults={postSearchResults}
        postSearchIsLoading={postSearchIsLoading}
        postSearchHasErrored={postSearchHasErrored}
        showClear={showClear}
      />
    );
    return (
      <div className="results content-container">
        <h2 className="sr-only">Search results</h2>
        {
          shouldShowSearchBar &&
          <ResultsSearchHeader
            ref={(ref) => { this.keywordRef = ref; }}
            onUpdate={onQueryParamUpdate}
            defaultKeyword={defaultKeyword}
            defaultLocation={defaultLocation}
          />
        }
        <div className="usa-grid-full results-section-container">
          <MediaQuery breakpoint="screenMdMin" widthType="min">
            {/* eslint-disable */}
            {matches => matches ? filterContainer : shouldShowMobileFilter && filterContainer}
            {/* eslint-enable */}
          </MediaQuery>
          <ResultsContainer
            results={results}
            isLoading={isLoading}
            hasErrored={hasErrored}
            sortBy={sortBy$}
            pageSize={defaultPageSize}
            totalResults={results.count}
            hasLoaded={hasLoaded || false}
            defaultSort={defaultSort}
            pageSizes={pageSizes}
            defaultPageSize={defaultPageSize}
            defaultPageNumber={defaultPageNumber}
            queryParamUpdate={onQueryParamUpdate}
            refreshKey={this.state.key}
            pillFilters={pillFilters}
            onQueryParamToggle={onQueryParamToggle}
            scrollToTop={scrollToTop}
            userProfile={userProfile}
            bidList={bidList}
          />
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  hasErrored: PropTypes.bool.isRequired,
  filtersIsLoading: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  results: POSITION_SEARCH_RESULTS,
  onQueryParamUpdate: PropTypes.func.isRequired,
  onQueryParamToggle: PropTypes.func.isRequired,
  sortBy: SORT_BY_PARENT_OBJECT.isRequired,
  defaultSort: PropTypes.node,
  pageSizes: SORT_BY_PARENT_OBJECT.isRequired,
  defaultPageSize: PropTypes.number,
  defaultPageNumber: PropTypes.number,
  defaultKeyword: PropTypes.string,
  defaultLocation: PropTypes.string,
  resetFilters: PropTypes.func.isRequired,
  pillFilters: PILL_ITEM_ARRAY,
  selectedAccordion: ACCORDION_SELECTION_OBJECT,
  setAccordion: PropTypes.func.isRequired,
  filters: FILTER_ITEMS_ARRAY,
  scrollToTop: PropTypes.func,
  userProfile: USER_PROFILE,
  fetchMissionAutocomplete: PropTypes.func.isRequired,
  missionSearchResults: MISSION_DETAILS_ARRAY.isRequired,
  missionSearchIsLoading: PropTypes.bool.isRequired,
  missionSearchHasErrored: PropTypes.bool.isRequired,
  fetchPostAutocomplete: PropTypes.func.isRequired,
  postSearchResults: POST_DETAILS_ARRAY.isRequired,
  postSearchIsLoading: PropTypes.bool.isRequired,
  postSearchHasErrored: PropTypes.bool.isRequired,
  shouldShowSearchBar: PropTypes.bool.isRequired,
  bidList: BID_RESULTS.isRequired,
  isProjectedVacancy: PropTypes.bool,
  showClear: PropTypes.bool,
  shouldShowMobileFilter: PropTypes.bool,
  isClient: PropTypes.bool,
};

Results.defaultProps = {
  results: { results: [] },
  hasErrored: false,
  isLoading: true,
  onQueryParamUpdate: EMPTY_FUNCTION,
  defaultSort: '',
  defaultPageSize: 10,
  defaultPageNumber: 0,
  defaultKeyword: '',
  defaultLocation: '',
  pillFilters: [],
  selectedAccordion: ACCORDION_SELECTION,
  filters: [],
  scrollToTop: EMPTY_FUNCTION,
  userProfile: {},
  currentSavedSearch: {},
  isProjectedVacancy: false,
  showClear: false,
  shouldShowMobileFilter: false,
  isClient: false,
};

Results.contextTypes = {
  router: PropTypes.object,
  isTandemSearch: PropTypes.bool,
};

Results.childContextTypes = {
  isProjectedVacancy: PropTypes.bool,
  isClient: PropTypes.bool,
};

export const mapStateToProps = state => ({
  shouldShowMobileFilter: state.shouldShowMobileFilter,
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(Results);
