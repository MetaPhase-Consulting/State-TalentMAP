import { Component } from 'react';
import PropTypes from 'prop-types';
import { checkFlag } from 'flags';
import PreferenceWrapper from 'Containers/PreferenceWrapper';
import {
  BID_PORTFOLIO_FILTERS, BID_PORTFOLIO_FILTERS_TYPE, BID_PORTFOLIO_SORTS,
  BID_PORTFOLIO_SORTS_TYPE, CLIENTS_PAGE_SIZES, UNASSIGNED_BIDDERS_FILTERS } from 'Constants/Sort';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { filter, findIndex, get, includes, isEqual } from 'lodash';
import { connect } from 'react-redux';
import Picky from 'react-picky';
import ListItem from 'Components/BidderPortfolio/BidControls/BidCyclePicker/ListItem';
import { bidderPortfolioSetUnassigned, setEditClassification, setIsCDOD30, setPanelDateID } from 'actions/bidderPortfolio';
import ToggleButton from 'Components/ToggleButton';
import ResultsPillContainer from '../../ResultsPillContainer/ResultsPillContainer';
import SelectForm from '../../SelectForm';
import ResultsViewBy from '../../ResultsViewBy/ResultsViewBy';
import BidCyclePicker from './BidCyclePicker';
import CDOAutoSuggest from '../CDOAutoSuggest';
import ResetFilters from '../../ResetFilters/ResetFilters';

const useUnassignedFilter = () => checkFlag('flags.unassigned_filters');

export function renderList({ items, selected, ...rest }) {
  const getIsSelected = item => !!selected.find(f => f.value === item.value);
  return items.map(item => (
    <ListItem key={item.value} item={item} {...rest} queryProp="text" getIsSelected={getIsSelected} />
  ));
}

class BidControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSeasons: true,
      proxyCdos: this.props.selection || [],
      bidSeasons: [],
      filterBy: {},
      unassignedFilter: false,
      panelClient: false,
      panelClientDate: '',
      unassignedBidders: [],
      pills: [],
      isCDOD30: false,
    };
  }

  UNSAFE_componentWillMount() {
    if (!(this.props.selection.length === 1 && get(this.props, 'selection[0].isCurrentUser', false))) {
      this.setState({ proxyCdos: this.props.selection }, this.generatePills);
    }
    const BID_PORTFOLIO_FILTERS$ = BID_PORTFOLIO_FILTERS;
    if (!useUnassignedFilter()) {
      BID_PORTFOLIO_FILTERS$.options = BID_PORTFOLIO_FILTERS.options.filter(b => b.value !== 'unassigned_filters');
    }
    this.setState({ filterBy: BID_PORTFOLIO_FILTERS$.options[
      findIndex(BID_PORTFOLIO_FILTERS$.options, (o) => o.value ===
        this.props.defaultHandshake)] });
    if (this.props.defaultHandshake === 'unassigned_filters' && this.state.bidSeasons.length) {
      this.setState({ unassignedFilter: true });
    }
    if (this.props.unassignedSelection.length) {
      this.setState({ unassignedBidders: this.props.unassignedSelection }, this.generatePills);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selection, nextProps.selection)) {
      if (!(nextProps.selection.length === 1 && get(nextProps, 'selection[0].isCurrentUser', false))) {
        this.setState({ proxyCdos: nextProps.selection }, this.generatePills);
      }
    }
  }

  onSeasonChange = (seasons, value) => {
    const hasSeasons = !!seasons.length;
    const { filterBy } = this.state;
    if (!this.state.bidSeasons.length && this.state.hasSeasons) {
      this.onFilterChange(get(filterBy, 'value'), value);
    }
    if (!isEqual(hasSeasons, this.state.hasSeasons)) {
      this.setState({ hasSeasons }, () => {
        this.onFilterChange(get(filterBy, 'value'), value);
      });
    }
    if (!isEqual(seasons, this.state.bidSeasons)) {
      this.setState({
        bidSeasons: seasons,
      }, () => {
        this.generatePills();
      });
    }
  };

  onFilterChange = (q, value) => {
    const BID_PORTFOLIO_FILTERS$ = BID_PORTFOLIO_FILTERS;
    if (!useUnassignedFilter()) {
      BID_PORTFOLIO_FILTERS$.options = BID_PORTFOLIO_FILTERS.options.filter(b => b.value !== 'unassigned_filters');
    }
    this.setState({ filterBy: BID_PORTFOLIO_FILTERS$.options[
      findIndex(BID_PORTFOLIO_FILTERS$.options, (o) => o.value === q)] },
    this.generatePills);
    this.setState({
      unassignedFilter: (q === 'unassigned_filters' && this.state.hasSeasons),
      panelClient: (q === 'panel_clients' && this.state.hasSeasons),
    });
    this.props.setEditClassification(q === 'classification');
    if (value === 'skip') {
      this.props.queryParamUpdate({ value: 'skip' });
    } else {
      this.props.queryParamUpdate({ hasHandshake: q });
    }
  };

  onUnassignedChange = q => {
    this.setState({ unassignedBidders: [q] }, this.generatePills);
    this.props.queryParamUpdate({});
    this.props.setUnassigned([q]);
  };

  onSortChange = q => {
    const orderingObject = { ordering: q.target.value };
    this.props.queryParamUpdate(orderingObject);
  };
  onCDOToggleChange = () => {
    const { isCDOD30 } = this.state;
    this.setState({ isCDOD30: !isCDOD30 });
    this.props.setCDOD30(!isCDOD30);
    this.resetAllFilters();
  };
  updateQueryLimit = q => {
    const { updatePagination } = this.props;
    updatePagination({ pageNumber: 1, pageSize: q.target.value });
    this.props.queryParamUpdate({ value: 'skip' });
  };

  generatePills = () => {
    const pills = [];
    const { filterBy } = this.state;
    this.state.proxyCdos.forEach(a => {
      pills.push({ description: a.name, selectionRef: 'proxyCdos', codeRef: a.hru_id });
    });
    this.state.bidSeasons.forEach(a => {
      pills.push({ description: a.description, selectionRef: 'bidSeasons', codeRef: a.id });
    });
    if (!includes(['', 'unassigned_filters'], get(filterBy, 'value', '')) && this.state.bidSeasons.length) {
      pills.push({
        description: filterBy.text,
        selectionRef: 'filterBy',
        codeRef: filterBy.value,
      });
    }
    const renderUnassigned = this.state.bidSeasons.length && isEqual('unassigned_filters', get(filterBy, 'value'));
    if (renderUnassigned) {
      this.state.unassignedBidders.forEach(a => {
        pills.push({ description: a.text, selectionRef: 'unassignedBidders', codeRef: a.value });
      });
    }
    this.setState({ pills });
  };

  resetAllFilters = () => {
    const { resetKeyword } = this.props;
    resetKeyword();
    this.setState({ proxyCdos: [] });
    this.updateMultiSelect([]);
    this.onFilterChange(BID_PORTFOLIO_FILTERS.options[0].value);
    this.setState({ unassignedBidders: [], unassignedFilter: false, panelClient: false });
    this.props.queryParamUpdate({ value: 'skip' });
    this.props.setPanelDateID('');
  };

  pillClick = (dropdownID, pillID) => {
    const q = filter(this.state.unassignedBidders, (o) => o.value !== pillID);
    switch (dropdownID) {
      case 'proxyCdos':
        this.setState({ proxyCdos:
                filter(this.state.proxyCdos, (o) => o.id !== pillID) }, this.generatePills);
        break;
      case 'bidSeasons':
        this.updateMultiSelect(filter(this.state.bidSeasons, (o) => o.id !== pillID));
        break;
      case 'filterBy':
        this.onFilterChange(BID_PORTFOLIO_FILTERS.options[0].value);
        break;
      case 'unassignedBidders':
        this.setState({ unassignedBidders: q }, this.generatePills);
        this.props.queryParamUpdate({ });
        this.props.setUnassigned(q);
        break;
      default:
    }
  };

  render() {
    const { viewType, changeViewType, defaultHandshake,
      defaultOrdering, pageSize, getKeyword, updatePagination, panelClientFetchData } = this.props;
    const { panelClient, isCDOD30, panelClientDate, hasSeasons, pills, proxyCdos, unassignedBidders, unassignedFilter } = this.state;
    const pageSizes = CLIENTS_PAGE_SIZES.options;
    const displayUnassignedFilter = useUnassignedFilter();
    const showClear = !!pills.length || getKeyword;
    const BID_PORTFOLIO_FILTERS$ = BID_PORTFOLIO_FILTERS;
    if (!displayUnassignedFilter) {
      BID_PORTFOLIO_FILTERS$.options = BID_PORTFOLIO_FILTERS.options.filter(b => b.value !== 'unassigned_filters');
    }

    const onPanelDateIDChange = (e) => {
      this.setState({ panelClientDate: e.target.value });
      this.props.setPanelDateID(e.target.value);
    };

    return (
      <div className="usa-grid-full portfolio-controls">
        <div className="usa-width-one-whole portfolio-sort-container results-dropdown">
          <div className="portfolio-sort-container-contents bid-cycle-picker-container" style={{ float: 'left' }}>
            <div className="label">Proxy CDO View:</div>
            <CDOAutoSuggest
              cdoPills={proxyCdos}
              updatePagination={updatePagination}
              pageSize={pageSize}
            />
          </div>
          <div className="portfolio-sort-container-contents small-screen-stack">
            <SelectForm
              id="num-clients"
              label="Display Clients:"
              options={pageSizes}
              defaultSort={pageSize}
              onSelectOption={this.updateQueryLimit}
            />
            <BidCyclePicker
              setSeasonsCb={(b, value) => this.onSeasonChange(b, value)}
              setClick={(a) => { this.updateMultiSelect = a; }}
              updatePagination={updatePagination}
              isMultiple={!isCDOD30}
            />
            { isCDOD30 &&
            <>
              <PreferenceWrapper
                onSelect={(q) => this.onFilterChange(q.target.value)}
                keyRef={BID_PORTFOLIO_FILTERS_TYPE}
              >
                <SelectForm
                  id="portfolio-filter"
                  options={BID_PORTFOLIO_FILTERS$.options}
                  label="Filter By:"
                  defaultSort={defaultHandshake}
                  disabled={!hasSeasons}
                />
              </PreferenceWrapper>
              { unassignedFilter &&
              <div className={`unassigned-bidder-picker-container usa-form ${!unassignedFilter ? 'unassigned-disabled' : ''}`}>
                <div className="label">Unassigned Bidders:</div>
                <Picky
                  placeholder="Select Criteria"
                  value={unassignedBidders}
                  options={UNASSIGNED_BIDDERS_FILTERS.options}
                  onChange={this.onUnassignedChange}
                  numberDisplayed={2}
                  dropdownHeight={255}
                  // multiple //commented out to prevent multiple selections
                  renderList={renderList}
                  valueKey="value"
                  labelKey="text"
                  includeSelectAll
                  disabled={!unassignedFilter}
                />
              </div>
              }
            </>
            }
            { panelClient &&
            <div className={`unassigned-bidder-picker-container usa-form ${!panelClient ? 'unassigned-disabled' : ''}`}>
              <div className="label">Panel Client Date:</div>
              <select
                value={panelClientDate}
                onChange={onPanelDateIDChange}
              >
                <option value="" />
                {
                  panelClientFetchData.map((d) => (
                    <option key={d.PM_SEQ_NUM} value={d.PM_SEQ_NUM}>{d.MEETING_DESC}</option>
                  ))
                }
              </select>
            </div>
            }
            <PreferenceWrapper
              onSelect={this.onSortChange}
              keyRef={BID_PORTFOLIO_SORTS_TYPE}
            >
              <SelectForm
                id="porfolio-sort"
                options={BID_PORTFOLIO_SORTS.options}
                label="Sort By:"
                defaultSort={defaultOrdering}
              />
            </PreferenceWrapper>
          </div>
        </div>
        <div className="usa-width-one-whole portfolio-sort-container results-dropdown">
          <ResultsViewBy initial={viewType} onClick={changeViewType} />
          <div className="jc-toggle-container">
            <ToggleButton
              labelTextRight={!isCDOD30 ? 'Toggle CDO D3.0 View' : 'Toggle Client Search View'}
              onChange={this.onCDOToggleChange}
              checked={isCDOD30}
              onColor="#0071BC"
            />
          </div>
        </div>
        <div className="usa-width-one-whole portfolio-filter-pills-container">
          { showClear && <ResetFilters resetFilters={this.resetAllFilters} /> }
          <ResultsPillContainer
            items={pills}
            onPillClick={this.pillClick}
            isClientsPage
          />
        </div>
      </div>
    );
  }
}

BidControls.propTypes = {
  queryParamUpdate: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  changeViewType: PropTypes.func.isRequired,
  defaultHandshake: PropTypes.string.isRequired,
  defaultOrdering: PropTypes.string.isRequired,
  selection: PropTypes.arrayOf(PropTypes.shape({})),
  setUnassigned: PropTypes.func.isRequired,
  setCDOD30: PropTypes.func.isRequired,
  setEditClassification: PropTypes.func.isRequired,
  setPanelDateID: PropTypes.func.isRequired,
  unassignedSelection: PropTypes.arrayOf(PropTypes.shape({})),
  getKeyword: PropTypes.string.isRequired,
  resetKeyword: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  updatePagination: PropTypes.func,
};

BidControls.defaultProps = {
  selection: [],
  unassignedSelection: [],
  pageSize: CLIENTS_PAGE_SIZES.defaultSort,
  updatePagination: EMPTY_FUNCTION,
  panelClientFetchData: [],
};

const mapStateToProps = state => ({
  selection: state.bidderPortfolioSelectedCDOsToSearchBy,
  unassignedSelection: state.bidderPortfolioSelectedUnassigned,
  panelClientFetchData: state.panelClientFetchData,
});

export const mapDispatchToProps = dispatch => ({
  setUnassigned: (arr = []) => dispatch(bidderPortfolioSetUnassigned(arr)),
  setCDOD30: (bool) => dispatch(setIsCDOD30(bool)),
  setEditClassification: (bool) => dispatch(setEditClassification(bool)),
  setPanelDateID: (id) => dispatch(setPanelDateID(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BidControls);
